"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import AccountForm from "./account-form";
import { insertAccountSchema } from "@/db/schema";
import { z } from "zod";
import { useEditAccount } from "../hooks/use-edit-account";
import useGetAccount from "../api/use-get-account";
import { Loader2 } from "lucide-react";
import useUpdateAccount from "../api/use-update-account";

const formSchema = insertAccountSchema.pick({ name: true });

type FormValues = z.infer<typeof formSchema>;

export default function UpdateAccountSheet() {
  const { isOpen, onClose, id } = useEditAccount();
  const mutation = useUpdateAccount(id);
  const account = useGetAccount(id);

  const isDisabled = account.isLoading || mutation.isPending;

  function onSubmit(values: FormValues) {
    mutation.mutate(values, {
      onSuccess: () => onClose?.(),
    })
  }
  return (
    <Sheet
      open={isOpen}
      onOpenChange={onClose}
    >
      <SheetContent className="flex flex-col gap-4">
        <SheetHeader>
          <SheetTitle>Update account - {id}</SheetTitle>
          <SheetDescription>Please fill up the form below to update the account</SheetDescription>
        </SheetHeader>
        {account.isLoading ? (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-muted-foreground" size={18} />
          </div>
        ) : (
          <AccountForm
            id={id}
            defaultValues={account.data ? {
              name: account.data.name
            } : { name: "" }}
            onSubmit={onSubmit}
            onDelete={onClose}
            disabled={isDisabled}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}