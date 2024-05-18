import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-screen w-full flex justify-center items-center fixed inset-0">
      <Loader2 className="animate-spin text-muted-foreground" />
    </div>
  )
}