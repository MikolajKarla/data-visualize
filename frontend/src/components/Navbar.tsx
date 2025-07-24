"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Settings, User, Moon, Sun, BarChart3 } from "lucide-react";

type HeaderProps = {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
};

const Header = ({ theme, setTheme }: HeaderProps) => {
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 text-xl font-bold text-foreground transition-all duration-200 hover:text-primary group"
          >
            <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-all duration-200">
              <BarChart3 size={24} />
            </div>
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Data Visualise
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200"
            >
              <Settings size={18} />
            </Button>

            {/* Theme Switcher */}
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-accent transition-all duration-200" 
              onClick={toggleTheme}
            >
              {theme === "light" ? (
                <Moon size={18} className="text-muted-foreground hover:text-foreground" />
              ) : (
                <Sun size={18} className="text-yellow-500 hover:text-yellow-400" />
              )}
            </Button>

            {/* Profile Icon */}
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl border-border hover:bg-accent hover:border-primary/20 transition-all duration-200"
            >
              <User size={18} className="text-muted-foreground hover:text-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
