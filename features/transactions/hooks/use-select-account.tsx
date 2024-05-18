import Select from "@/components/shared/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import useCreateAccount from "@/features/accounts/api/use-create-account";
import useGetAccounts from "@/features/accounts/api/use-get-accounts";
import { useState } from "react";

export default function useSelectAccount(title: string, message: string): [() => JSX.Element, () => Promise<unknown>] {
  const [promise, setPromise] = useState<{ resolve: (data: string | null | undefined) => void } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null | undefined>(null);
  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onAccountCreate = (name: string) => accountMutation.mutate({ name });
  const accountsOptions = (accountQuery?.data || []).map(acc => ({
    label: acc.name,
    value: acc.id,
  }));
  const confirm = () => new Promise((resolve) => {
    setPromise({ resolve })
  });
  const handleClose = () => setPromise(null);
  const handleCancel = () => {
    promise?.resolve(null);
    handleClose();
  }
  const handleSubmit = () => {
    promise?.resolve(selectedId);
    handleClose();
  }
  const ConfirmElement = () => (
    <Dialog
      open={promise !== null}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <Select
          placeholder="Select an account"
          value={selectedId}
          options={accountsOptions}
          onCreate={onAccountCreate}
          onChange={(value) => setSelectedId(value)}
        />
        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ); 
  return [ConfirmElement, confirm]
}