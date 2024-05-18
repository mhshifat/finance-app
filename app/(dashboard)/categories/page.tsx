"use client";

import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import useDeleteCategories from "@/features/categories/api/use-delete-categories";
import useGetCategories from "@/features/categories/api/use-get-categories";
import NewCategoryBtn from "@/features/categories/components/new-category-btn";
import { useEditCategory } from "@/features/categories/hooks/use-edit-category";
import useConform from "@/hooks/use-confirm";
import { honoClient } from "@/lib/hono";
import { ColumnDef } from "@tanstack/react-table"
import { InferResponseType } from "hono";
import { ArrowUpDown, Edit, Loader2, MoreHorizontal } from "lucide-react"

type ResponseType = InferResponseType<typeof honoClient.api.categories.$get, 200>;
type Category = ResponseType["data"][0];

const columns: ColumnDef<Category>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
]

export default function CategoriesPage() {
  const { onOpen } = useEditCategory();
  const categories = useGetCategories();
  const deleteCategories = useDeleteCategories();
  const [ConfirmDialog, confirm] = useConform(
    "Are you sure?",
    "You are about to perform a bulk delete"
  );

  const isDisabled = categories.isLoading || deleteCategories.isPending;

  if (categories.isLoading) return (
    <div>
      <Card>
        <CardHeader>
          <Skeleton
            className="h-8 w-48"
          />
        </CardHeader>
        <CardContent>
          <div className="h-[500px] w-full flex items-center justify-center">
            <Loader2
              className="animate-spin text-slate-300 size-6"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
  return (
    <section>
      <ConfirmDialog />
      <Card>
        <CardHeader>
          <CardTitle className="w-full flex items-center justify-between gap-5">
            <span className="text-2xl font-semibold line-clamp-1">My Categories</span>

            <div className="ml-auto">
              <NewCategoryBtn />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="name" 
            columns={
              columns.concat([
                {
                  id: "actions",
                  cell: ({ row }) => (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          disabled={isDisabled}
                          onClick={() => onOpen(row.original.id)}
                          className="flex items-center gap-2"
                        >
                          <Edit size={18} className="text-muted-foreground" />
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )
                }
              ])
            } 
            data={categories.data || []}
            onDelete={async (rows) => {
              const ok = await confirm();
              if (ok) {
                deleteCategories.mutate({
                  ids: rows.map(row => row.original.id)
                })
              }
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </section>
  )
}