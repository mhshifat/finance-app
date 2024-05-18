"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNewTransaction } from "../hooks/use-new-transaction";

export default function NewTransactionBtn() {
  const { onOpen } = useNewTransaction();

  return (
    <Button size="sm" className="flex items-center gap-2" onClick={onOpen}>
      <Plus size={18} />
      Add new transaction
    </Button>
  )
}