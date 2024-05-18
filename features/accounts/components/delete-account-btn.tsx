import { Button } from "@/components/ui/button";
import useDeleteAccount from "../api/use-delete-account";
import useConform from "@/hooks/use-confirm";
import { Trash } from "lucide-react";
import { cloneElement, PropsWithChildren, ReactElement } from "react";

interface DeleteAccountBtnProps {
  id: string;
  disabled?: boolean;
  onDelete?: () => void;
}

export default function DeleteAccountBtn({
  id,
  disabled,
  onDelete,
  children
}: PropsWithChildren<DeleteAccountBtnProps>) {
  const mutation = useDeleteAccount(id);
  const [ConfirmDialog, confirm] = useConform(
    "Are you sure?",
    "You are about to delete this account"
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
        Delete account
      </Button>
      <ConfirmDialog />
    </>
  )
}