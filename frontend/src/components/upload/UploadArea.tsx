import React from "react";
import { Upload } from "lucide-react";

interface UploadAreaProps {
  dragActive: boolean;
  loading: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

const UploadArea: React.FC<UploadAreaProps> = ({
  dragActive,
  loading,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileChange,
  fileInputRef,
}) => {
  return (
    <label
      htmlFor="file-upload"
      className={`relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
        dragActive
          ? "border-primary bg-primary/10 scale-[1.02] shadow-lg"
          : "border-border hover:border-primary/50 hover:bg-accent/30"
      } ${loading ? "pointer-events-none opacity-50" : ""}`}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="flex flex-col items-center text-center">
        <div className={`p-4 rounded-xl mb-4 transition-all duration-300 ${
          dragActive ? "bg-primary text-primary-foreground" : "bg-accent/50 text-muted-foreground"
        }`}>
          <Upload size={32} />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Drop your file here
        </h3>
        <p className="text-muted-foreground mb-4">
          or click to browse from your computer
        </p>
        <div className="flex items-center gap-2 text-sm">
          <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full font-medium">
            CSV
          </span>
          <span className="text-primary">•</span>
          <span className="text-primary font-medium">Max 10MB</span>
        </div>
      </div>
      <input
        id="file-upload"
        type="file"
        accept=".csv"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={onFileChange}
        ref={fileInputRef}
        disabled={loading}
      />
    </label>
  );
};

export default UploadArea;
