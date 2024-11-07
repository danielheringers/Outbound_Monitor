import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { MonitorProvider } from "@/context/MonitorContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import KeepAlive from "@/components/KeepAlive";

const googleSansMono = localFont({
  src: [
    {
      path: './fonts/ProductSans-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/ProductSans-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: "--font-google-sans-mono",
});

export const metadata: Metadata = {
  title: "Monitor Outbound",
  description: "Criado por Daniel Heringer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${googleSansMono.variable} ${googleSansMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MonitorProvider>
            {children}
            <SpeedInsights />
            <KeepAlive />
          </MonitorProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
