import { honoClient } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export default function useGetCategory(id?: string) {
  return useQuery({
    enabled: !!id,
    queryKey: ["category", { id }],
    queryFn: async () => {
      const res = await honoClient.api.categories[":id"].$get({
        param: { id }
      });
      if (!res.ok) throw new Error("Failed to fetch category!");
      const { data } = await res.json();
      return data;
    }
  })
}