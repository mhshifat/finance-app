import { honoClient } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof honoClient.api.transactions[":id"]["$delete"]>;

export default function useDeleteTransaction(id?: string) {
  const queryClient = useQueryClient();
  
  return useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const res = await honoClient.api.transactions[":id"]["$delete"]({ param: { id } });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Successfully deleted the transaction!");
      queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      toast.error("Failed to delete the transaction!");
    },
  })
}