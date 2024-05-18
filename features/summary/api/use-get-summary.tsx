import { honoClient } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function useGetSummary() {
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const accountId = params.get("accountId") || "";

  return useQuery({
    queryKey: ["summary", { from, to, accountId }],
    queryFn: async () => {
      const res = await honoClient.api.summary.$get({
        query: { from, to, accountId }
      });
      if (!res.ok) throw new Error("Failed to fetch transactions!");
      const { data } = await res.json();
      return {
        ...data,
        incomeAmount: convertAmountFromMiliunits(data.incomeAmount),
        expensesAmount: convertAmountFromMiliunits(data.expensesAmount),
        remainingAmount: convertAmountFromMiliunits(data.remainingAmount),
        categories: data.categories.map(item => ({
          ...item,
          value: convertAmountFromMiliunits(item.value)
        })),
        days: data.days.map(item => ({
          ...item,
          income: convertAmountFromMiliunits(item.income),
          expenses: convertAmountFromMiliunits(item.expenses),
        })),
      };
    }
  })
}