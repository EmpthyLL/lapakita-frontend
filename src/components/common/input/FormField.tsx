import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { useMemo } from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

// ── 1. FIELD CONTAINER (Menggantikan Div biasa dengan struktur Field) ──
const FormItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    orientation?: "vertical" | "horizontal" | "responsive";
  }
>(({ className, orientation = "vertical", ...props }, ref) => {
  const id = React.useId();
  const { getFieldState, formState } = useFormContext();
  const fieldContext = React.useContext(FormFieldContext);

  const fieldState = fieldContext?.name
    ? getFieldState(fieldContext.name, formState)
    : null;
  const isInvalid = fieldState?.invalid ?? false;

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        ref={ref}
        role="group"
        data-slot="field"
        data-orientation={orientation}
        data-invalid={isInvalid}
        className={cn(
          "group/field flex w-full gap-2 data-[invalid=true]:text-destructive",
          orientation === "vertical" && "flex-col *:w-full [&>.sr-only]:w-auto",
          orientation === "horizontal" &&
            "flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto",
          orientation === "responsive" &&
            "flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto",
          className,
        )}
        {...props}
      />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

// ── 2. LABEL ──
const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      data-slot="field-label"
      className={cn(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
        error && "text-destructive",
        className,
      )}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

// ── 3. CONTROL (Binding ke Input / Elemen) ──
const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

// ── 4. DESCRIPTION ──
const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<"p">
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      data-slot="field-description"
      className={cn(
        "text-left text-xs/relaxed leading-normal font-normal text-muted-foreground",
        "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className,
      )}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

// ── 5. MESSAGE / ERROR (Bawaan File Field Kamu) ──
const FormMessage = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    children?: React.ReactNode;
    errors?: Array<{ message?: string } | undefined>;
  }
>(({ className, children, errors: propErrors, ...props }, ref) => {
  const { error } = useFormField();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const errors = propErrors || (error ? [error] : undefined);

  const content = useMemo(() => {
    if (children) return children;
    if (!errors?.length) return null;

    const uniqueErrors = [
      ...new Map(errors.map((err) => [err?.message, err])).values(),
    ];

    if (uniqueErrors?.length === 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map(
          (err, index) => err?.message && <li key={index}>{err.message}</li>,
        )}
      </ul>
    );
  }, [children, errors]);

  if (!content) return null;

  return (
    <div
      ref={ref}
      role="alert"
      data-slot="field-error"
      className={cn("text-xs font-normal text-destructive", className)}
      {...props}
    >
      {content}
    </div>
  );
});
FormMessage.displayName = "FormMessage";

// ── 6. EKSISTENSI SEMUA KOMPONEN FIELD PENDUKUNG LAINNYA ──
const FormSet = React.forwardRef<
  HTMLFieldSetElement,
  React.ComponentProps<"fieldset">
>(({ className, ...props }, ref) => (
  <fieldset
    ref={ref}
    data-slot="field-set"
    className={cn(
      "flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
      className,
    )}
    {...props}
  />
));
FormSet.displayName = "FormSet";

const FormLegend = React.forwardRef<
  HTMLLegendElement,
  React.ComponentProps<"legend"> & { variant?: "legend" | "label" }
>(({ className, variant = "legend", ...props }, ref) => (
  <legend
    ref={ref}
    data-slot="field-legend"
    data-variant={variant}
    className={cn(
      "mb-2.5 font-medium data-[variant=label]:text-xs data-[variant=legend]:text-sm",
      className,
    )}
    {...props}
  />
));
FormLegend.displayName = "FormLegend";

const FormFieldGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="field-group"
    className={cn(
      "group/field-group @container/field-group flex w-full flex-col gap-5 data-[slot=checkbox-group]:gap-3",
      className,
    )}
    {...props}
  />
));
FormFieldGroup.displayName = "FormFieldGroup";

const FormFieldContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="field-content"
    className={cn(
      "group/field-content flex flex-1 flex-col gap-0.5 leading-snug",
      className,
    )}
    {...props}
  />
));
FormFieldContent.displayName = "FormFieldContent";

const FormFieldTitle = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="field-label"
    className={cn(
      "flex w-fit items-center gap-2 text-xs/relaxed group-data-[disabled=true]/field:opacity-50",
      className,
    )}
    {...props}
  />
));
FormFieldTitle.displayName = "FormFieldTitle";

const FormFieldSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { children?: React.ReactNode }
>(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="field-separator"
    data-content={!!children}
    className={cn(
      "relative -my-2 h-5 text-xs group-data-[variant=outline]/field-group:-mb-2",
      className,
    )}
    {...props}
  >
    <Separator className="absolute inset-0 top-1/2" />
    {children && (
      <span
        className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
        data-slot="field-separator-content"
      >
        {children}
      </span>
    )}
  </div>
));
FormFieldSeparator.displayName = "FormFieldSeparator";

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormFieldContent,
  FormFieldGroup,
  FormFieldSeparator,
  FormFieldTitle,
  FormItem,
  FormLabel,
  FormLegend,
  FormMessage,
  FormSet,
  useFormField,
};
