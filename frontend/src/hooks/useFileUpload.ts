import { useState, useRef } from "react";

export const useFileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileProcessing, setFileProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFileProcessing(true);
      // Simulate file processing delay (you can add actual file validation here)
      await new Promise(resolve => setTimeout(resolve, 800));
      setSelectedFile(event.target.files[0]);
      setFileProcessing(false);
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
      setFileProcessing(true);
      // Simulate file processing delay (you can add actual file validation here)
      await new Promise(resolve => setTimeout(resolve, 800));
      setSelectedFile(e.dataTransfer.files[0]);
      setFileProcessing(false);
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
    setLoading(true);
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.message === "File uploaded successfully") {
        setColumns(result.columns);
        setUploadSuccess(true);
        // Small delay to show success state before transitioning
        setTimeout(() => {
          // The component will automatically show DataVisualize when columns.length > 0
        }, 1000);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
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
