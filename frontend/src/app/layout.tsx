import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthGuard } from "@/components/AuthGuard";

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
    <html lang="en" className={inter.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('theme');
                  if (stored === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else if (stored === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (systemDark) {
                      document.documentElement.classList.add('dark');
                    }
                  }
                } catch (e) {
                  // Fallback in case of localStorage errors
                }
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}
