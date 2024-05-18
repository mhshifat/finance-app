import { honoClient } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof honoClient.api.categories[":id"]["$delete"]>;

export default function useDeleteCategory(id?: string) {
  const queryClient = useQueryClient();
  
  return useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const res = await honoClient.api.categories[":id"]["$delete"]({ param: { id } });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Successfully deleted the category!");
      queryClient.invalidateQueries({ queryKey: ["category", { id }] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      toast.error("Failed to delete the category!");
    },
  })
}