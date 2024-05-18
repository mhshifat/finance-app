import { honoClient } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export default function useGetAccount(id?: string) {
  return useQuery({
    enabled: !!id,
    queryKey: ["account", { id }],
    queryFn: async () => {
      const res = await honoClient.api.accounts[":id"].$get({
        param: { id }
      });
      if (!res.ok) throw new Error("Failed to fetch account!");
      const { data } = await res.json();
      return data;
    }
  })
}