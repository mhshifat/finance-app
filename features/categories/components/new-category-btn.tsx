"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNewCategory } from "../hooks/use-new-category";

export default function NewCategoryBtn() {
  const { onOpen } = useNewCategory();

  return (
    <Button size="sm" className="flex items-center gap-2" onClick={onOpen}>
      <Plus size={18} />
      Add new category
    </Button>
  )
}