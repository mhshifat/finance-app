import { honoClient } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export default function useGetCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await honoClient.api.categories.$get();
      if (!res.ok) throw new Error("Failed to fetch categories!");
      const { data } = await res.json();
      return data;
    }
  })
}