"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { FiMoon, FiSun } from "react-icons/fi";
import { Button } from "./ui/button";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-base-200 animate-pulse">
        <Image
          src="data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=="
          width={36}
          height={36}
          sizes="36x36"
          alt="Loading Light/Dark Toggle"
          priority={false}
          title="Loading Light/Dark Toggle"
        />
      </span>
    );

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() =>
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
      }
      className="transition-all duration-200"
    >
      <span className="sr-only">Toggle theme</span>
      {resolvedTheme === "dark" ? (
        <FiSun className="text-yellow-400 transition-transform duration-200 scale-100 hover:rotate-12" />
      ) : (
        <FiMoon className="text-blue-500 transition-transform duration-200 scale-100 hover:-rotate-12" />
      )}
    </Button>
  );
}