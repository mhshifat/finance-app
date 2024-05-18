import ClientOnly from "@/components/shared/client-only";
import NewAccountSheet from "@/features/accounts/components/new-account-sheet";
import UpdateAccountSheet from "@/features/accounts/components/update-account-sheet";
import NewCategorySheet from "@/features/categories/components/new-category-sheet";
import UpdateCategorySheet from "@/features/categories/components/update-category-sheet";
import NewTransactionSheet from "@/features/transactions/components/new-transaction-sheet";
import UpdateTransactionSheet from "@/features/transactions/components/update-transaction-sheet";

export default function SheetProvider() {
  return (
    <ClientOnly>
      <NewAccountSheet />
      <UpdateAccountSheet />
      <NewCategorySheet />
      <UpdateCategorySheet />
      <NewTransactionSheet />
      <UpdateTransactionSheet />
    </ClientOnly>
  )
}