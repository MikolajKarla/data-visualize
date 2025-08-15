"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Settings, User, BarChart3, LogOut, LogIn, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { usePathname } from "next/navigation";
import ThemeSwitcher from "./ThemeSwitcher";



const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
              
             Projekty
            </div>
          )}

          <div className="flex items-center gap-2">
          

            {isAuthenticated ? (
              <div className="flex items-center gap-2 ml-1">
                {/* User Dropdown */}
                <div 
                  className="relative group"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 rounded-xl text-sm hover:bg-accent transition-all duration-200"
                  >
                    {user?.profile?.first_name || user?.email || 'Użytkownik'}
                    <ChevronDown 
                      size={14} 
                      className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    />
                  </Button>
                  
                  {/* Dropdown Menu */}
                  <div className={`absolute right-0 mt-2 w-48 bg-background border border-border rounded-xl shadow-lg transition-all duration-200 z-50 ${
                    isDropdownOpen 
                      ? 'opacity-100 visible transform translate-y-0' 
                      : 'opacity-0 invisible transform -translate-y-2'
                  }`}>
                    <div className="p-2 space-y-1">
                      <Link href="/profile" className="block">
                        <Button
                          variant={isActive('/profile') ? "secondary" : "ghost"}
                          size="sm"
                          className="gap-2 rounded-lg w-full justify-start hover:bg-accent transition-colors duration-200"
                        >
                          <User size={16} />
                          Profil
                        </Button>
                      </Link>
                      <Link href="/settings" className="block">
                        <Button
                          variant={isActive('/settings') ? "secondary" : "ghost"}
                          size="sm"
                          className="gap-2 rounded-lg w-full justify-start hover:bg-accent transition-colors duration-200"
                        >
                          <Settings size={16} />
                          Ustawienia
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
                
                <ThemeSwitcher />
                
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-xl ml-2 hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Wyloguj</span>
                </Button>
              </div>

      
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <ThemeSwitcher/>
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
