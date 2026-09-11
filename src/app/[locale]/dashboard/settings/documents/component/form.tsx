"use client";

import { DocumentInput } from "@/components/common/input/DocumentInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/input/FormField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { uploadDocument } from "@/lib/data/api/user";
import {
  uploadDocumentSchema,
  UploadDocumentValues,
} from "@/lib/data/schema/user/document";
import { handleError } from "@/lib/error";
import { showToast } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

interface DocumentFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export function DocumentForm({ onSuccess, onCancel }: DocumentFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<UploadDocumentValues>({
    resolver: zodResolver(uploadDocumentSchema),
    defaultValues: {
      full_name_ktp: "",
      nik: "",
      domicile_city: "",
      ktp_photo: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: UploadDocumentValues) => {
      await uploadDocument(values);
    },
    onSuccess: () => {
      showToast.success("Document uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["user-document"] });
      onSuccess();
    },
    onError: handleError,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        className="space-y-5 pt-3"
      >
        <FormField
          control={form.control}
          name="full_name_ktp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name (as in KTP)</FormLabel>
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
          name="nik"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIK (16 Digits)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter 16 digits NIK"
                  maxLength={16}
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
          name="domicile_city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domicile City</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter domicile city"
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
          name="ktp_photo"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DocumentInput
                  title="KTP Photo / Document"
                  multiple={false}
                  value={
                    field.value
                      ? {
                          name: "ktp-document",
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
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" isLoading={mutation.isPending}>
            Upload Document
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
