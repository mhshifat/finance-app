import { PropsWithChildren } from "react";
import { Toaster } from 'sonner';
import QueryProvider from "./query-provider";
import SheetProvider from "./sheet-provider";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <SheetProvider />
      <Toaster />
      {children}
    </QueryProvider>
  )
}