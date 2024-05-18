import { honoClient } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof honoClient.api.categories[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof honoClient.api.categories[":id"]["$patch"]>["json"];

export default function useUpdateCategory(id?: string) {
  const queryClient = useQueryClient();
  
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await honoClient.api.categories[":id"]["$patch"]({ json, param: { id } });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Successfully updated the category!");
      queryClient.invalidateQueries({ queryKey: ["category", { id }] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      toast.error("Failed to update the category!");
    },
  })
}