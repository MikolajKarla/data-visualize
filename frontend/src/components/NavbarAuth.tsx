"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Settings, User, Moon, Sun, BarChart3, LogOut, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { usePathname } from "next/navigation";

type HeaderProps = {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
};

const Header = ({ theme, setTheme }: HeaderProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleLogout = () => {
    logout();
  };

  const isActive = (path: string) => pathname === path;

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

          {/* Navigation Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              <Link href="/profile">
                <Button 
                  variant={isActive('/profile') ? "default" : "ghost"}
                  size="sm"
                  className="gap-2 rounded-xl"
                >
                  <User size={16} />
                  Profil
                </Button>
              </Link>
              <Link href="/settings">
                <Button 
                  variant={isActive('/settings') ? "default" : "ghost"}
                  size="sm"
                  className="gap-2 rounded-xl"
                >
                  <Settings size={16} />
                  Ustawienia
                </Button>
              </Link>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200"
            >
              {!mounted ? (
                <div className="w-[18px] h-[18px]" />
              ) : theme === "light" ? (
                <Moon size={18} />
              ) : (
                <Sun size={18} />
              )}
            </Button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 ml-2">
                <div className="hidden sm:block text-sm font-medium text-foreground">
                  {user?.profile?.first_name || user?.email || 'Użytkownik'}
                </div>
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  size="sm"
                  className="gap-2 rounded-xl"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Wyloguj</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link href="/auth/login">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="gap-2 rounded-xl"
                  >
                    <LogIn size={16} />
                    Zaloguj
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button 
                    size="sm"
                    className="rounded-xl bg-primary hover:bg-primary/90"
                  >
                    Rejestracja
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
