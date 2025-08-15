import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthGuard } from "@/components/AuthGuard";
import { Providers } from "@/components/provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Data Visualise App",
  description: "Create beautiful data visualizations from your CSV files",
  keywords: ["data visualization", "charts", "graphs", "CSV", "analytics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          <AuthGuard>
            {children}
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
