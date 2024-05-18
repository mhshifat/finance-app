import { honoClient } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export default function useGetAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const res = await honoClient.api.accounts.$get();
      if (!res.ok) throw new Error("Failed to fetch accounts!");
      const { data } = await res.json();
      return data;
    }
  })
}