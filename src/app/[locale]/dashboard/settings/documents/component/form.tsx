/* eslint-disable @next/next/no-img-element */
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
import { Autocomplete } from "@/components/common/long/autocomplete";
import { DataDisplaySurfaceComponentProps } from "@/components/common/long/data-display/Constant";
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

import { CountryOption, getAllCountryOptions } from "@/lib/countries";
import { handleError } from "@/lib/error";
import { showToast } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit3, ListFilter } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  getDefaultDocumentLabel,
  getDocumentFieldMeta,
  getDocumentLabelPresets,
  getDocumentTypeExamples,
} from "./config";

const DOCUMENT_TYPES = [
  { label: "National ID / Identity Card", value: "national_id" },
  { label: "Passport", value: "passport" },
  { label: "Residence Permit / Visa", value: "residence_permit" },
];

export function DocumentForm({
  row,
  mode,
  close,
}: DataDisplaySurfaceComponentProps<GetDocumentData>) {
  const queryClient = useQueryClient();
  const isEdit = mode === "edit";
  const countryOptions = getAllCountryOptions();

  const form = useForm<UploadDocumentValues>({
    resolver: zodResolver(uploadDocumentSchema),
    defaultValues: {
      country_code: row?.country_code ?? "ID",
      document_type: row?.document_type ?? "national_id",
      document_label: row?.document_label ?? "KTP",
      full_name_identity: row?.full_name_identity ?? "",
      document_number: row?.document_number ?? "",
      document_photo: row?.document_photo_url ?? "",
    },
  });

  const selectedCountry = form.watch("country_code");
  const selectedDocumentType = form.watch("document_type");
  const currentLabelValue = form.watch("document_label");

  const labelPresets = getDocumentLabelPresets(
    selectedCountry,
    selectedDocumentType,
  );
  const isPresetLabel = labelPresets.includes(currentLabelValue);

  const [labelInputMode, setLabelInputMode] = useState<"preset" | "custom">(
    isPresetLabel || !currentLabelValue ? "preset" : "custom",
  );

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
        className="space-y-4 p-2"
      >
        {/* Pilih Negara Menggunakan Autocomplete */}
        <FormField
          control={form.control}
          name="country_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issuing Country</FormLabel>
              <FormControl>
                <Autocomplete<CountryOption>
                  value={field.value}
                  onSelect={(val) => {
                    const countryCode = String(val);
                    field.onChange(countryCode);
                    const newDefault = getDefaultDocumentLabel(
                      countryCode,
                      selectedDocumentType,
                    );
                    form.setValue("document_label", newDefault);
                  }}
                  options={countryOptions}
                  valueKey="value"
                  labelKey="label"
                  searchKey="label"
                  iconKey="flag"
                  placeholder="Select country..."
                  disabled={isEdit}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Jenis Dokumen */}
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
                  const newDefault = getDefaultDocumentLabel(
                    selectedCountry,
                    val,
                  );
                  form.setValue("document_label", newDefault);
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

        {/* Document Label dengan Toggle (Preset Dinamis vs Custom Input) */}
        <FormField
          control={form.control}
          name="document_label"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Document Label / Subtype</FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    if (labelInputMode === "preset") {
                      setLabelInputMode("custom");
                    } else {
                      setLabelInputMode("preset");
                      field.onChange(
                        getDefaultDocumentLabel(
                          selectedCountry,
                          selectedDocumentType,
                        ),
                      );
                    }
                  }}
                >
                  {labelInputMode === "preset" ? (
                    <>
                      <Edit3 className="h-3 w-3 mr-1" /> Type Custom Label
                    </>
                  ) : (
                    <>
                      <ListFilter className="h-3 w-3 mr-1" /> Use Preset List
                    </>
                  )}
                </Button>
              </div>

              <FormControl>
                {labelInputMode === "preset" ? (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-9 bg-background border-border">
                      <SelectValue placeholder="Select document label" />
                    </SelectTrigger>
                    <SelectContent>
                      {labelPresets.map((presetLabel) => (
                        <SelectItem key={presetLabel} value={presetLabel}>
                          {presetLabel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    placeholder="Enter custom label (e.g. Special ID, Work Permit)"
                    {...field}
                    value={field.value ?? ""}
                  />
                )}
              </FormControl>
              <FormDescription className="text-xs text-muted-foreground">
                Label specific name or prefix for this identity document.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Full Name */}
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

        {/* Document Number */}
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

        {/* Document Photo */}
        <FormField
          control={form.control}
          name="document_photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Photo / Scan</FormLabel>
              <FormControl>
                <DocumentInput
                  title="Upload Document Scan"
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
