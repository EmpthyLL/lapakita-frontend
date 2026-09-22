"use client";

import { DocumentInput } from "@/components/common/input/DocumentInput";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/input/FormField";
import { DataDisplayFormComponentProps } from "@/components/common/long/data-display/Constant";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadDocument } from "@/lib/data/api/user";
import {
  GetDocumentData,
  uploadDocumentSchema,
  UploadDocumentValues,
} from "@/lib/data/schema/user/document";
import { handleError } from "@/lib/error";
import { showToast } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getDocumentFieldMeta, getDocumentTypeExamples } from "./config";

const DOCUMENT_TYPES = [
  { label: "National ID (KTP)", value: "national_id" },
  { label: "Passport", value: "passport" },
  { label: "Residence Permit", value: "residence_permit" },
];

export function DocumentForm({
  row,
  mode,
  close,
}: DataDisplayFormComponentProps<GetDocumentData>) {
  const queryClient = useQueryClient();
  const isEdit = mode === "edit";

  const form = useForm<UploadDocumentValues>({
    resolver: zodResolver(uploadDocumentSchema),
    defaultValues: {
      document_type: row?.document_type ?? "national_id",
      full_name_identity: row?.full_name_identity ?? "",
      document_number: row?.document_number ?? "",
      document_photo: row?.document_photo_url ?? "",
    },
  });

  const selectedDocumentType = form.watch("document_type");
  const fieldMeta = getDocumentFieldMeta(selectedDocumentType);
  const typeExamples = getDocumentTypeExamples(selectedDocumentType);

  const mutation = useMutation({
    mutationFn: async (values: UploadDocumentValues) => {
      await uploadDocument(values);
    },
    onSuccess: () => {
      showToast.success(
        isEdit
          ? "Document updated successfully"
          : "Document uploaded successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["user-document"] });
      close();
    },
    onError: handleError,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        className="space-y-4 pt-2 px-2"
      >
        <FormField
          control={form.control}
          name="document_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Type</FormLabel>
              <Select
                onValueChange={(val) => {
                  field.onChange(val);
                  form.setValue("document_number", "");
                }}
                defaultValue={field.value}
                disabled={isEdit}
              >
                <FormControl>
                  <SelectTrigger className="h-9 bg-background border-border">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {typeExamples && !isEdit && (
                <FormDescription className="text-xs text-muted-foreground">
                  {typeExamples}
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="full_name_identity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name (as in Identity)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter full name"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="document_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{fieldMeta.label}</FormLabel>
              <FormControl>
                <Input
                  placeholder={fieldMeta.placeholder}
                  maxLength={fieldMeta.maxLength}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              {fieldMeta.hint && (
                <FormDescription className="text-xs text-muted-foreground">
                  {fieldMeta.hint}
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="document_photo"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DocumentInput
                  title="Document Photo / Scan"
                  multiple={false}
                  value={
                    field.value
                      ? {
                          name: "document-file",
                          size: 0,
                          type: "image/jpeg",
                          base64: field.value,
                        }
                      : null
                  }
                  onChange={(doc) => {
                    if (doc && !Array.isArray(doc)) {
                      field.onChange(doc.base64);
                    } else {
                      field.onChange("");
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="pt-4 border-t border-border flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={close}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={mutation.isPending}
            className="rounded-xl"
          >
            {isEdit ? "Save Changes" : "Upload Document"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
