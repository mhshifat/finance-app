import Header from "@/components/shared/header";
import { PropsWithChildren } from "react";

export default function DashboardLayout({ children }: PropsWithChildren) {
  const classes = "w-12 h-12 p-8 size-4 bg-slate-300 rounded-md gap-9 grid-cols-3 mt-5 grid grid-cols-[1fr_400px] gap-10 bg-white flex items-center justify-center shadow-md z-50 grid-cols-2";
  return (
    <>
      <Header />
      <main className="container py-10">
        {children}
      </main>
    </>
  )
}