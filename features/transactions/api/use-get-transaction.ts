import { honoClient } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export default function useGetTransaction(id?: string) {
  return useQuery({
    enabled: !!id,
    queryKey: ["transaction", { id }],
    queryFn: async () => {
      const res = await honoClient.api.transactions[":id"].$get({
        param: { id }
      });
      if (!res.ok) throw new Error("Failed to fetch transaction!");
      const { data } = await res.json();
      return {
        ...data,
        amount: convertAmountFromMiliunits(data.amount)
      };
    }
  })
}