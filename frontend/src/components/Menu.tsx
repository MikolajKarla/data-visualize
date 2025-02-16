"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Settings, User, Moon, Sun } from "lucide-react";

const Header = () => {
  const [theme, setTheme] = useState("dark");

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
    <header className={`flex top-0 left-0 h-[10vh] w-full ${theme=="light"? "bg-gray-600": "bg-black-900/80 opacity-90"}   backdrop-blur-md shadow-md text-black z-50`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-white transition-all duration-200 hover:text-black"
        >
          Data Visualise
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="p-2 group">
            <Settings size={18} className="text-gray-400 group-hover:text-gray-500 transition-all duration-200" />
          </Button>

          {/* Theme Switcher */}
          <Button variant="ghost" className="p-2 group" onClick={toggleTheme}>
            {theme === "light" ? (
              <Moon size={18} className="text-sky-200 group-hover:text-gray-500 transition-all duration-200" />
            ) : (
              <Sun size={18} className="text-yellow-400 group-hover:text-yellow-300 transition-all duration-200" />
            )}
          </Button>

          {/* Profile Icon */}
          <Button
            variant="outline"
            className="p-2 rounded-full border-gray-700 dark:border-gray-500 group"
          >
            <User size={18} className="text-gray-500  group-hover:text-gray-900 transition-all duration-200" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
