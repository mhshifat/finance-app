import { honoClient } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof honoClient.api.transactions["bulk-create"]["$post"]>;
type RequestType = InferRequestType<typeof honoClient.api.transactions["bulk-create"]["$post"]>["json"];

export default function useCreateTransactions() {
  const queryClient = useQueryClient();
  
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await honoClient.api.transactions["bulk-create"]["$post"]({ json });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Successfully created the transactions!");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      toast.error("Failed to create the transactions!");
    },
  })
}