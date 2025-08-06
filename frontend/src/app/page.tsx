"use client";

import React, { useEffect, useState } from "react";
import FileUpload from "@/components/FileUpload";
import NavbarAuth from "@/components/NavbarAuth";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    // This will only run on the client side
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") {
        return stored;
      }
      // Check system preference
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return systemDark ? "dark" : "light";
    }
    return "light"; // Default for SSR
  });

  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <NavbarAuth theme={theme} setTheme={setTheme} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <FileUpload />
        </div>
      </main>
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <p className="text-sm text-muted-foreground font-medium">
              Data Visualise App • Created by{" "}
              <span className="text-primary font-semibold">Mikołaj Karla</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}