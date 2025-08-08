import "../globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { MonitorProvider } from "@/context/MonitorContext";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MonitorProvider>
        {children}
        <SpeedInsights />
      </MonitorProvider>
      <Toaster />
    </ThemeProvider>
  );
}
