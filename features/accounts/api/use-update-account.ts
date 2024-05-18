import { honoClient } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof honoClient.api.accounts[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof honoClient.api.accounts[":id"]["$patch"]>["json"];

export default function useUpdateAccount(id?: string) {
  const queryClient = useQueryClient();
  
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await honoClient.api.accounts[":id"]["$patch"]({ json, param: { id } });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Successfully updated the account!");
      queryClient.invalidateQueries({ queryKey: ["account", { id }] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      toast.error("Failed to update the account!");
    },
  })
}