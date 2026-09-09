"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/input/FormField";
import { DataDisplay } from "@/components/common/long/data-display";
import {
  ColumnDef,
  DataDisplayQuery,
} from "@/components/common/long/data-display/Constant";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  addPhoneNumber,
  deletePhoneNumber,
  getPhoneNumbers,
  updatePhoneNumber,
} from "@/lib/data/api/user";
import {
  PhoneNumberItem,
  PhoneQueryParams,
  phoneRequestSchema,
  PhoneValues,
} from "@/lib/data/schema/user/phone_number";
import { handleError } from "@/lib/error";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  MoreVertical,
  Pencil,
  Phone as PhoneIcon,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const AVAILABLE_ROLES = [
  {
    label: "Tenant",
    value: "tenant",
    activeClass: "border-tenant bg-tenant/10 text-tenant",
  },
  {
    label: "Owner",
    value: "owner",
    activeClass: "border-owner bg-owner/10 text-owner",
  },
  {
    label: "Supplier",
    value: "supplier",
    activeClass: "border-supplier bg-supplier/10 text-supplier",
  },
];

export default function PhoneManagementPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState<PhoneNumberItem | null>(
    null,
  );

  const form = useForm<PhoneValues>({
    resolver: zodResolver(phoneRequestSchema),
    defaultValues: {
      number: "",
      is_primary: false,
      roles: [],
    },
  });

  const queryConfig: DataDisplayQuery<PhoneNumberItem, PhoneQueryParams> = {
    queryFn: getPhoneNumbers,
    queryKey: (params) => ["phone-numbers-paginated", params],
    searchKey: "number",
    defaultParams: { page: 1 },
  };

  const columns: ColumnDef<PhoneNumberItem>[] = [
    {
      key: "number",
      header: "Phone Number",
      icon: PhoneIcon,
      primary: true,
      className: "font-mono font-semibold text-foreground",
    },
    {
      key: "is_primary",
      header: "Status Primary",
      icon: ShieldCheck,
      render: (val) =>
        Boolean(val) ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> Primary
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Secondary</span>
        ),
    },
    {
      key: "roles",
      header: "Connected Roles",
      render: (val) => {
        const roles = (val as string[]) || [];
        if (roles.length === 0) {
          return (
            <span className="text-xs text-muted-foreground italic">
              No roles linked
            </span>
          );
        }
        return (
          <div className="flex flex-wrap gap-1">
            {roles.map((r) => (
              <Badge
                key={r}
                variant="secondary"
                className="capitalize text-[10px] px-2 py-0.5 font-medium"
              >
                {r}
              </Badge>
            ))}
          </div>
        );
      },
    },
  ];

  const saveMutation = useMutation({
    mutationFn: async (values: PhoneValues) => {
      // Validasi logika role unik di client sebelum kirim ke API jika perlu
      if (selectedPhone) {
        // Asumsi identifier menggunakan number lama atau index di API
        await updatePhoneNumber(selectedPhone.number, values);
      } else {
        await addPhoneNumber(values);
      }
    },
    onSuccess: () => {
      showToast.success(
        selectedPhone
          ? "Phone number updated successfully"
          : "Phone number added successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["phone-numbers-paginated"] });
      setDialogOpen(false);
      form.reset({ number: "", is_primary: false, roles: [] });
      setSelectedPhone(null);
    },
    onError: handleError,
  });

  const deleteMutation = useMutation({
    mutationFn: async (number: string) => {
      await deletePhoneNumber(number);
    },
    onSuccess: () => {
      showToast.success("Phone number deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["phone-numbers-paginated"] });
      setDeleteModalOpen(false);
      setSelectedPhone(null);
    },
    onError: handleError,
  });

  function handleOpenAdd() {
    setSelectedPhone(null);
    form.reset({ number: "", is_primary: false, roles: [] });
    setDialogOpen(true);
  }

  function handleOpenEdit(item: PhoneNumberItem) {
    setSelectedPhone(item);
    form.reset({
      number: item.number,
      is_primary: item.is_primary,
      roles: item.roles || [],
    });
    setDialogOpen(true);
  }

  function handleOpenDelete(item: PhoneNumberItem) {
    setSelectedPhone(item);
    setDeleteModalOpen(true);
  }

  function onSubmit(values: PhoneValues) {
    saveMutation.mutate(values);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="absolute top-0 right-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-brand opacity-10 blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <PhoneIcon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">
                Phone Number Management
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage your phone contacts, primary assignment, and role
                associations.
              </p>
            </div>
          </div>
          <Button
            onClick={handleOpenAdd}
            size="sm"
            className="gap-1.5 rounded-xl"
          >
            <Plus className="h-4 w-4" /> Add Phone Number
          </Button>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <DataDisplay
          columns={columns}
          query={queryConfig}
          rowKey="number"
          variant="list"
          loadMode="pagination"
          showFilter
          showCount
          renderItem={(row, index) => (
            <div className="group flex items-center justify-between rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
              <div className="flex items-center gap-4 min-w-0">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border font-mono font-bold text-xs bg-secondary text-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold font-mono text-foreground">
                      {row.number}
                    </p>
                    {row.is_primary && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {row.roles && row.roles.length > 0 ? (
                      row.roles.map((r) => (
                        <Badge
                          key={r}
                          variant="outline"
                          className="capitalize text-[10px] px-1.5 py-0 font-normal"
                        >
                          {r}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-[11px] text-muted-foreground italic">
                        No roles linked
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem
                    onClick={() => handleOpenEdit(row)}
                    className="cursor-pointer gap-2 text-xs"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleOpenDelete(row)}
                    className="cursor-pointer gap-2 text-xs text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        />
      </div>

      {/* Dialog Add / Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle>
              {selectedPhone ? "Edit Phone Number" : "Add Phone Number"}
            </DialogTitle>
            <DialogDescription>
              Pastikan nomor minimal 10 digit. Setiap role hanya boleh terikat
              ke satu nomor unik.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 pt-3"
            >
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. +6281234567890"
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
                name="is_primary"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-xl border border-border p-3.5 bg-secondary/30 space-y-0">
                    <div className="space-y-0.5 pr-4">
                      <FormLabel className="text-sm font-semibold cursor-pointer">
                        Set as Primary
                      </FormLabel>
                      <p className="text-[11px] text-muted-foreground">
                        Hanya satu nomor yang dapat menjadi primary di akun
                        Anda.
                      </p>
                    </div>
                    <FormControl>
                      <div className="shrink-0">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Linked Roles</FormLabel>
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {AVAILABLE_ROLES.map((role) => {
                        const currentRoles = field.value || [];
                        const isChecked = currentRoles.includes(role.value);
                        return (
                          <button
                            key={role.value}
                            type="button"
                            onClick={() => {
                              if (isChecked) {
                                field.onChange(
                                  currentRoles.filter((r) => r !== role.value),
                                );
                              } else {
                                field.onChange([...currentRoles, role.value]);
                              }
                            }}
                            className={cn(
                              "flex items-center justify-center rounded-xl border py-2 text-xs font-semibold transition-all cursor-pointer outline-none",
                              isChecked
                                ? role.activeClass
                                : "border-border bg-background text-muted-foreground hover:bg-secondary",
                            )}
                          >
                            {role.label}
                          </button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={saveMutation.isPending}>
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="max-w-sm rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle>Delete Phone Number</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus nomor{" "}
              <span className="font-mono font-semibold text-foreground">
                {selectedPhone?.number}
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4 flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              isLoading={deleteMutation.isPending}
              onClick={() =>
                selectedPhone && deleteMutation.mutate(selectedPhone.number)
              }
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
