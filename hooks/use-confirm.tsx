import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

export default function useConform(title: string, message: string): [() => JSX.Element, () => Promise<unknown>] {
  const [promise, setPromise] = useState<{ resolve: (data: boolean) => void } | null>(null);

  const confirm = () => new Promise((resolve) => setPromise({ resolve }));
  const handleClose = () => setPromise(null);
  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  }
  const handleSubmit = () => {
    promise?.resolve(true);
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
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ); 
  return [ConfirmElement, confirm]
}