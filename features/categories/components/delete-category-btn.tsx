import { Button } from "@/components/ui/button";
import useConform from "@/hooks/use-confirm";
import { Trash } from "lucide-react";
import { cloneElement, PropsWithChildren, ReactElement } from "react";
import useDeleteCategory from "../api/use-delete-category";

interface DeleteCategoryBtnProps {
  id: string;
  disabled?: boolean;
  onDelete?: () => void;
}

export default function DeleteCategoryBtn({
  id,
  disabled,
  onDelete,
  children
}: PropsWithChildren<DeleteCategoryBtnProps>) {
  const mutation = useDeleteCategory(id);
  const [ConfirmDialog, confirm] = useConform(
    "Are you sure?",
    "You are about to delete this category"
  )

  async function handleDelete() {
    const ok = await confirm();
    if (ok) {
      mutation.mutate(undefined, {
        onSuccess: () => {
          onDelete?.();
        },
      })
    }
  }
  return children ? cloneElement(children as ReactElement, {
    disabled: mutation.isPending || disabled,
    onClick: handleDelete
  }) : (
    <>
      <Button
        className="flex items-center gap-2 w-full"
        type="button"
        variant="outline"
        disabled={mutation.isPending || disabled}
        onClick={handleDelete}
      >
        <Trash size={18} />
        Delete category
      </Button>
      <ConfirmDialog />
    </>
  )
}