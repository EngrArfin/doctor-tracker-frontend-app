"use client";

import { Toaster } from "sonner";

export function DashboardToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      duration={4000}
      theme="light"
      toastOptions={{
        className:
          "font-sans shadow-2xl border border-slate-200/90 rounded-2xl py-3.5 px-4 bg-white text-slate-900",
        classNames: {
          title: "text-slate-900 font-bold text-sm",
          description: "text-slate-600 font-normal text-xs mt-1",
          actionButton: "bg-blue-600 text-white font-semibold text-xs px-3 py-1.5 rounded-lg",
          cancelButton: "bg-slate-100 text-slate-700 font-medium text-xs px-3 py-1.5 rounded-lg",
          closeButton: "border border-slate-200 bg-white hover:bg-slate-100 text-slate-500",
          info: "!bg-blue-50 !border-blue-200 !text-blue-950 [&_[data-description]]:!text-blue-800 [&_[data-title]]:!text-blue-950",
          success: "!bg-emerald-50 !border-emerald-200 !text-emerald-950 [&_[data-description]]:!text-emerald-800 [&_[data-title]]:!text-emerald-950",
          warning: "!bg-amber-50 !border-amber-200 !text-amber-950 [&_[data-description]]:!text-amber-900 [&_[data-title]]:!text-amber-950",
          error: "!bg-rose-50 !border-rose-200 !text-rose-950 [&_[data-description]]:!text-rose-800 [&_[data-title]]:!text-rose-950",
        },
        style: {
          background: "#ffffff",
          color: "#0f172a",
          border: "1px solid #e2e8f0",
        },
      }}
    />
  );
}
