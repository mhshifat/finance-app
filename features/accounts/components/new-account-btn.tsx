"use client";

import { Button } from "@/components/ui/button";
import { useNewAccount } from "../hooks/use-new-account";
import { Plus } from "lucide-react";

export default function NewAccountBtn() {
  const { onOpen } = useNewAccount();

  return (
    <Button size="sm" className="flex items-center gap-2" onClick={onOpen}>
      <Plus size={18} />
      Add new account
    </Button>
  )
}