"use client";

import React, { useEffect, useState } from "react";
import FileUpload from "@/components/FileUpload";
import Navbar from "@/components/Navbar";

function getInitialTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("theme");
  return stored === "light" ? "light" : "dark";
}

export default function Home() {
  const [theme, setTheme] = useState(getInitialTheme());
  
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <Navbar theme = {theme} setTheme={setTheme} />
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