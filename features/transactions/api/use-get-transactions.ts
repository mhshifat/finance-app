import { honoClient } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function useGetTransactions() {
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const accountId = params.get("accountId") || "";

  return useQuery({
    queryKey: ["transactions", { from, to, accountId }],
    queryFn: async () => {
      const res = await honoClient.api.transactions.$get({
        query: { from, to, accountId }
      });
      if (!res.ok) throw new Error("Failed to fetch tra.transactions!");
      const { data } = await res.json();
      return data.map((item) => ({
        ...item,
        amount: convertAmountFromMiliunits(item.amount)
      }));
    }
  })
}