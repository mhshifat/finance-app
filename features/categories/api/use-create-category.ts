import { honoClient } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof honoClient.api.categories.$post>;
type RequestType = InferRequestType<typeof honoClient.api.categories.$post>["json"];

export default function useCreateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await honoClient.api.categories.$post({ json });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Category created!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Failed to create the category!");
    },
  })
}