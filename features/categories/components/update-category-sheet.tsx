"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import CategoryForm from "./category-form";
import { insertCategoriesSchema } from "@/db/schema";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useEditCategory } from "../hooks/use-edit-category";
import useUpdateCategory from "../api/use-update-category";
import useGetCategory from "../api/use-get-category";

const formSchema = insertCategoriesSchema.pick({ name: true });

type FormValues = z.infer<typeof formSchema>;

export default function UpdateCategorySheet() {
  const { isOpen, onClose, id } = useEditCategory();
  const mutation = useUpdateCategory(id);
  const category = useGetCategory(id);

  const isDisabled = category.isLoading || mutation.isPending;

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
          <SheetTitle>Update category - {id}</SheetTitle>
          <SheetDescription>Please fill up the form below to update the category</SheetDescription>
        </SheetHeader>
        {category.isLoading ? (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-muted-foreground" size={18} />
          </div>
        ) : (
          <CategoryForm
            id={id}
            defaultValues={category.data ? {
              name: category.data.name
            } : { name: "" }}
            onSubmit={onSubmit}
            onDelete={onClose}
            disabled={isDisabled}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}