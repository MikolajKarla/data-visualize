import { useState, useRef } from "react";
import { useAuth } from "@/lib/auth";
import toast from "react-hot-toast";

export const useFileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileProcessing, setFileProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token } = useAuth();

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return "Please select a CSV file only.";
    }
    
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return "File size must be less than 10MB.";
    }
    
    // Check if file is empty
    if (file.size === 0) {
      return "The selected file is empty.";
    }
    
    return null;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Validate file
      const error = validateFile(file);
      if (error) {
        toast.error(error);
        return;
      }
      
      setFileProcessing(true);
      // Simulate file processing delay (you can add actual file validation here)
      await new Promise(resolve => setTimeout(resolve, 800));
      setSelectedFile(file);
      setFileProcessing(false);
      toast.success("File selected successfully!");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading || fileProcessing) return; // Don't allow drag during loading or file processing
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (loading || fileProcessing) return; // Don't allow drop during loading
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Validate file
      const error = validateFile(file);
      if (error) {
        toast.error(error);
        return;
      }
      
      setFileProcessing(true);
      // Simulate file processing delay (you can add actual file validation here)
      await new Promise(resolve => setTimeout(resolve, 800));
      setSelectedFile(file);
      setFileProcessing(false);
      toast.success("File selected successfully!");
    }
  };

  const handleDeleteFile = () => {
    setSelectedFile(null);
    setColumns([]);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    if (!token) {
      toast.error("Authentication required. Please sign in to upload files.");
      return;
    }
    
    setLoading(true);
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed. Please sign in again.");
        } else if (response.status === 413) {
          throw new Error("File too large. Please select a smaller file.");
        } else if (response.status === 422) {
          throw new Error("Invalid file format. Please upload a valid CSV file.");
        } else {
          throw new Error(`Upload failed with status ${response.status}. Please try again.`);
        }
      }

      const result = await response.json();
      if (result.message === "File uploaded successfully") {
        setColumns(result.columns);
        setUploadSuccess(true);
        toast.success("File uploaded successfully! Ready to create visualizations.");
        // Small delay to show success state before transitioning
        setTimeout(() => {
          // The component will automatically show DataVisualize when columns.length > 0
        }, 1000);
      } else {
        throw new Error(result.message || "Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    selectedFile,
    columns,
    loading,
    fileProcessing,
    uploadSuccess,
    dragActive,
    fileInputRef,
    // Handlers
    handleFileChange,
    handleDrag,
    handleDrop,
    handleDeleteFile,
    handleUpload,
  };
};
