import React from "react";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({ children, className, delay = 0 }) => {
  return (
    <div
      className={cn("animate-fade-in", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

interface SlideUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const SlideUp: React.FC<SlideUpProps> = ({ children, className, delay = 0 }) => {
  return (
    <div
      className={cn("animate-slide-up", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

interface ScaleInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const ScaleIn: React.FC<ScaleInProps> = ({ children, className, delay = 0 }) => {
  return (
    <div
      className={cn("animate-scale-in", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = "md", 
  className 
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-muted border-t-primary",
        sizeClasses[size],
        className
      )}
    />
  );
};

interface ShimmerProps {
  className?: string;
}

export const Shimmer: React.FC<ShimmerProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/20 to-muted bg-[length:200%_100%] rounded-lg",
        className
      )}
    />
  );
};
