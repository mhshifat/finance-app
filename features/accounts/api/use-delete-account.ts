import { honoClient } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof honoClient.api.accounts[":id"]["$delete"]>;

export default function useDeleteAccount(id?: string) {
  const queryClient = useQueryClient();
  
  return useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const res = await honoClient.api.accounts[":id"]["$delete"]({ param: { id } });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Successfully deleted the account!");
      queryClient.invalidateQueries({ queryKey: ["account", { id }] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      toast.error("Failed to delete the account!");
    },
  })
}