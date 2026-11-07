import type { Metadata } from "next";
import "./globals.css";
import { DashboardToaster } from "@/components/ui/Toaster";
import { DoctorTrackerProvider } from "@/context/DoctorTrackerContext";
import ReduxProviderWrapper from "@/redux/redux-provider/reduxProviderWrapper";

export const metadata: Metadata = {
  title: "Doctor Tracker — Clinical Administration Dashboard",
  description:
    "A modern, high-performance healthcare administrative dashboard engineered for clinical operations leads and hospital administrators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <ReduxProviderWrapper>
          <DoctorTrackerProvider>
            {children}
            <DashboardToaster />
          </DoctorTrackerProvider>
        </ReduxProviderWrapper>
      </body>
    </html>
  );
}
