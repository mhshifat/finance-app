import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { insertCategoriesSchema } from "@/db/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DeleteCategoryBtn from "./delete-category-btn";

const formSchema = insertCategoriesSchema.pick({ name: true });

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
}

export default function CategoryForm({
  onSubmit,
  defaultValues,
  onDelete,
  id,
  disabled
}: CategoryFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      name: ""
    }
  });

  function handleSubmit(values: FormValues) {
    onSubmit(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Travel" disabled={disabled} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          disabled={disabled}
        >{id ? "Save changes" : "Create category"}</Button>
        {!!id && (
          <DeleteCategoryBtn
            id={id}
            disabled={disabled}
            onDelete={onDelete}
          />
        )}
      </form>
    </Form>
  )
}