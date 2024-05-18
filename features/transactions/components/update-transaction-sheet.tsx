"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { insertTransactionsSchema } from "@/db/schema";
import { z } from "zod";
import { useEditTransaction } from "../hooks/use-edit-transaction";
import { Loader2 } from "lucide-react";
import useUpdateAccount from "../api/use-update-transaction";
import TransactionForm from "./transaction-form";
import useGetAccounts from "@/features/accounts/api/use-get-accounts";
import useCreateAccount from "@/features/accounts/api/use-create-account";
import useGetCategories from "@/features/categories/api/use-get-categories";
import useCreateCategory from "@/features/categories/api/use-create-category";
import useGetTransaction from "../api/use-get-transaction";

const formSchema = insertTransactionsSchema.omit({ id: true });

type FormValues = z.infer<typeof formSchema>;

export default function UpdateTransactionSheet() {
  const { isOpen, onClose, id } = useEditTransaction();
  const mutation = useUpdateAccount(id);
  const transaction = useGetTransaction(id);

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const accountsOptions = (accountQuery?.data || []).map(acc => ({
    label: acc.name,
    value: acc.id,
  }));
  const onAccountCreate = (name: string) => accountMutation.mutate({ name });

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const categoriesOptions = (categoryQuery?.data || []).map(cat => ({
    label: cat.name,
    value: cat.id,
  }));
  const onCategoryCreate = (name: string) => categoryMutation.mutate({ name });

  const isPending = mutation.isPending
    || categoryMutation.isPending
    || accountMutation.isPending;

  const isLoading = categoryQuery.isLoading
    || accountQuery.isLoading
    || transaction.isLoading;

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
          <SheetTitle>Update transaction - {id}</SheetTitle>
          <SheetDescription>Please fill up the form below to update the transactions</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-muted-foreground" size={18} />
          </div>
        ) : (
          <TransactionForm
            id={id}
            defaultValues={{
                date: transaction.data?.date ? new Date(transaction.data?.date) : new Date(),
                accountId: transaction.data?.accountId || "",
                categoryId: transaction.data?.categoryId || "",
                payee: transaction.data?.payee || "",
                amount: String(transaction.data?.amount || ""),
                notes: transaction.data?.notes || ""
            }}
            onDelete={onClose}
            onSubmit={onSubmit}
            disabled={isPending}
            accountsOptions={accountsOptions}
            onAccountCreate={onAccountCreate}
            categoriesOptions={categoriesOptions}
            onCategoryCreate={onCategoryCreate}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}