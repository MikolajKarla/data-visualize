import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  loading: boolean;
  isFileProcessing?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loading, isFileProcessing = false }) => {
  if (!loading) return null;

  const loadingText = isFileProcessing 
    ? {
        title: "Reading your file...",
        subtitle: "Analyzing file structure"
      }
    : {
        title: "Processing your file...",
        subtitle: "This may take a few moments"
      };

  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
        <p className="text-sm font-medium text-foreground">{loadingText.title}</p>
        <p className="text-xs text-muted-foreground mt-1">{loadingText.subtitle}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
