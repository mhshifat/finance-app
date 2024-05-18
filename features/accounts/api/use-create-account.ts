import { honoClient } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof honoClient.api.accounts.$post>;
type RequestType = InferRequestType<typeof honoClient.api.accounts.$post>["json"];

export default function useCreateAccount() {
  const queryClient = useQueryClient();
  
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await honoClient.api.accounts.$post({ json });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Account created!");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: () => {
      toast.error("Failed to create the account!");
    },
  })
}