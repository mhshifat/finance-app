import { honoClient } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof honoClient.api.transactions.$post>;
type RequestType = InferRequestType<typeof honoClient.api.transactions.$post>["json"];

export default function useCreateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await honoClient.api.transactions.$post({ json });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Transaction created!");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      toast.error("Failed to create the transaction!");
    },
  })
}