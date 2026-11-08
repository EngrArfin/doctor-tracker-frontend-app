"use client";

import { Toaster } from "sonner";

export function DashboardToaster() {
  return (
    <Toaster
      position="top-right"
      closeButton
      duration={4500}
      theme="light"
      toastOptions={{
        className:
          "font-sans shadow-xl border border-slate-200/90 rounded-2xl py-3.5 px-4 bg-white text-slate-900",
        classNames: {
          title: "text-slate-900 font-bold text-sm",
          description: "text-slate-700 font-normal text-xs mt-1 leading-relaxed",
          actionButton: "bg-blue-600 text-white font-semibold text-xs px-3 py-1.5 rounded-lg",
          cancelButton: "bg-slate-100 text-slate-700 font-medium text-xs px-3 py-1.5 rounded-lg",
          closeButton: "border border-slate-200 bg-white hover:bg-slate-100 text-slate-500",
          info: "!bg-blue-50/95 !border-blue-200 !text-blue-950",
          success: "!bg-emerald-50/95 !border-emerald-200 !text-emerald-950",
          warning: "!bg-amber-50/95 !border-amber-200 !text-amber-950",
          error: "!bg-rose-50/95 !border-rose-200 !text-rose-950",
        },
      }}
    />
  );
}
