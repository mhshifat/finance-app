"use client";

import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useEditAccount } from "@/features/accounts/hooks/use-edit-account";
import { useEditCategory } from "@/features/categories/hooks/use-edit-category";
import useGetTransactions from "@/features/transactions/api/use-get-transactions";
import ImportTransactionsBtn from "@/features/transactions/components/import-transactions-btn";
import NewTransactionBtn from "@/features/transactions/components/new-transaction-btn";
import { useEditTransaction } from "@/features/transactions/hooks/use-edit-transaction";
import useConform from "@/hooks/use-confirm";
import { honoClient } from "@/lib/hono";
import { cn, convertAmountToMiliunits, formatCurrency } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns";
import { InferResponseType } from "hono";
import { ArrowUpDown, Edit, Loader2, MoreHorizontal, TriangleAlert } from "lucide-react"
import { ImportTransactionsResults } from '@/features/transactions/components/import-transactions-btn';
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useSelectAccount from "@/features/transactions/hooks/use-select-account";
import { toast } from "sonner";
import useCreateTransactions from "@/features/transactions/api/use-create-transactions";
import useDeleteTransactions from "@/features/transactions/api/use-delete-transactions";

type ResponseType = InferResponseType<typeof honoClient.api.transactions.$get, 200>;
type Transaction = ResponseType["data"][0];

const columns: ColumnDef<Transaction>[] = [
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
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.original.date as unknown as Date;

      return (
        <span>{format(date, "dd MMMM, yyyy")}</span>
      )
    }
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const category = row.original.category;
      const categoryId = row.original.categoryId;

      return <CategoryColumn transactionId={row.original.id} category={category} categoryId={categoryId} />
    }
  },
  {
    accessorKey: "payee",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = row.original.amount;

      return (
        <Badge variant={amount > 0 ? "outline" : "destructive"}>{formatCurrency(amount)}</Badge>
      )
    }
  },
  {
    accessorKey: "account",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Account
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const account = row.original.account;
      const accountId = row.original.accountId;

      return <AccountColumn account={account} accountId={accountId} />
    }
  },
];

function CategoryColumn({
  category,
  categoryId,
  transactionId,
}: {
  transactionId: string,
  category: string | null,
  categoryId: string | null
}) {
  const { onOpen } = useEditCategory();
  const { onOpen: onEditTTransactionOpen } = useEditTransaction();

  return (
    <span className={cn("hover:underline cursor-pointer flex items-center gap-2", {
      "text-rose-500": !category
    })} onClick={() => categoryId ? onOpen(categoryId) : onEditTTransactionOpen(transactionId)}>
      {!category && <TriangleAlert className="size-4" />}
      {category || "Uncategorized"}
    </span>
  )
}

function AccountColumn({
  account,
  accountId
}: {
  account: string,
  accountId: string
}) {
  const { onOpen } = useEditAccount();

  return (
    <span className="hover:underline cursor-pointer" onClick={() => onOpen(accountId)}>{account}</span>
  )
}

export default function TransactionsPage() {
  const [variant, setVariant] = useState<"list" | "import">("list");
  const [importResults, setImportResults] = useState<ImportTransactionsResults>({
    data: [],
    meta: [],
    errors: [],
  });
  const { onOpen } = useEditTransaction();
  const transactions = useGetTransactions();
  const deleteTransactions = useDeleteTransactions();
  const createTransactions = useCreateTransactions();
  const [selectedColumns, setSelectedColumns] = useState<{ [key: string]: string }>({});
  const [ConfirmDialog, confirm] = useConform(
    "Are you sure?",
    "You are about to perform a bulk delete"
  );
  const [SelectAnAccountDialog, confirmSelectAnAccount] = useSelectAccount(
    "Select an account",
    "Please select an account to continue"
  );

  const isDisabled = transactions.isLoading || deleteTransactions.isPending;
  const importHeaders = importResults.data[0];
  const importBody = importResults.data.slice(1);
  const importOptions = [
    "date",
    "payee",
    "amount",
    "notes",
  ];
  const requiredOptions = [
    "date",
    "payee",
    "amount",
  ];

  function handleImportTransactions(results: ImportTransactionsResults) {
    setVariant("import");
    setImportResults(results);
  }
  function handleCancel() {
    setVariant("list");
    setImportResults({
      data: [],
      meta: [],
      errors: [],
    });
  }
  async function handleUpload() {
    const data = importBody.map(row => row.reduce((acc, val, idx) => {
      if (Object.keys(selectedColumns).includes(`column_${idx}`)) (acc as Record<string, string>)[selectedColumns[`column_${idx}`]] = val;
      return acc;
    }, {})).map((item: any) => ({
      ...item,
      date: format(item.date, "yyyy-MM-dd"),
      amount: convertAmountToMiliunits(parseInt(item.amount))
    }));
    const accountId = await confirmSelectAnAccount();
    if (!accountId) return toast.error("Please select an account to continue");
    createTransactions.mutate(data.map(item => ({ ...item, accountId })), {
      onSuccess: () => {
        handleCancel?.();
      }
    })
  }

  if (variant === "import") {
    return (
      <div>
        <SelectAnAccountDialog />
        <Card>
          <CardHeader>
            <CardTitle className="w-full flex items-center justify-between gap-5">
              <span className="text-2xl font-semibold line-clamp-1">Transactions Mapper</span>

              <div className="ml-auto flex items-center gap-2">
                <Button onClick={handleCancel}>Cancel</Button>
                <Button disabled={!requiredOptions.every(item => Object.values(selectedColumns).includes(item))} onClick={handleUpload}>Continue ({Object.values(selectedColumns).filter(item => requiredOptions.includes(item)).length}/{requiredOptions.length})</Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  {importHeaders.map((item, itemIdx) => (
                    <TableHead key={item}>
                      <Select
                        value={selectedColumns[`column_${itemIdx}`]}
                        onValueChange={(value) => setSelectedColumns(values => ({...values, [`column_${itemIdx}`]: value}))}
                      >
                        <SelectTrigger className="uppercase">
                          <SelectValue placeholder="Skip" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="skip" className="uppercase">Skip</SelectItem>
                          {importOptions.map(opt => (
                            <SelectItem disabled={Object.values(selectedColumns).includes(opt)} key={opt} value={opt} className="uppercase">{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {importBody.map((row, rowIdx) => (
                  <TableRow key={rowIdx}>
                    {importHeaders.map((col, idx) => (
                      <TableCell key={idx}>
                        {row[idx]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (transactions.isLoading) return (
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
            <span className="text-2xl font-semibold line-clamp-1">Transactions History</span>

            <div className="ml-auto flex items-center gap-2">
              <NewTransactionBtn />
              <ImportTransactionsBtn onUpload={handleImportTransactions} />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="payee" 
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
            data={transactions.data || []}
            onDelete={async (rows) => {
              const ok = await confirm();
              if (ok) {
                deleteTransactions.mutate({
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