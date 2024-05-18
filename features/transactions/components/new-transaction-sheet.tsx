"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { insertTransactionsSchema } from "@/db/schema";
import { z } from "zod";
import { useNewTransaction } from "../hooks/use-new-transaction";
import useCreateTransaction from "../api/use-create-transaction";
import useGetAccounts from "@/features/accounts/api/use-get-accounts";
import useCreateAccount from "@/features/accounts/api/use-create-account";
import useGetCategories from "@/features/categories/api/use-get-categories";
import useCreateCategory from "@/features/categories/api/use-create-category";
import TransactionForm from "./transaction-form";
import Loading from "@/components/shared/Loading";

const formSchema = insertTransactionsSchema.omit({ id: true });

type FormValues = z.infer<typeof formSchema>;

export default function NewTransactionSheet() {
  const { isOpen, onClose } = useNewTransaction();
  const mutation = useCreateTransaction();

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
    || accountQuery.isLoading;

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
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Create a new transaction</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <Loading />
        ) : (
          <TransactionForm
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