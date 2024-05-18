"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import CategoryForm from "./category-form";
import { insertCategoriesSchema } from "@/db/schema";
import { z } from "zod";
import { useNewCategory } from "../hooks/use-new-category";
import useCreateCategory from "../api/use-create-category";

const formSchema = insertCategoriesSchema.pick({ name: true });

type FormValues = z.infer<typeof formSchema>;

export default function NewCategorySheet() {
  const { isOpen, onClose } = useNewCategory();
  const mutation = useCreateCategory();

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
          <SheetTitle>Create a category</SheetTitle>
          <SheetDescription>Please fill up the form below to create a new category</SheetDescription>
        </SheetHeader>
        <CategoryForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
        />
      </SheetContent>
    </Sheet>
  )
}