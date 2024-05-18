"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useNewAccount } from "../hooks/use-new-account";
import AccountForm from "./account-form";
import { insertAccountSchema } from "@/db/schema";
import { z } from "zod";
import useCreateAccount from "../api/use-create-account";

const formSchema = insertAccountSchema.pick({ name: true });

type FormValues = z.infer<typeof formSchema>;

export default function NewAccountSheet() {
  const { isOpen, onClose } = useNewAccount();
  const mutation = useCreateAccount();

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
          <SheetTitle>Create an account</SheetTitle>
          <SheetDescription>Please fill up the form below to create a new account</SheetDescription>
        </SheetHeader>
        <AccountForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
        />
      </SheetContent>
    </Sheet>
  )
}