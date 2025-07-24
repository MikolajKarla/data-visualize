"use client";
import React from "react";
import DataVisualize from "./DataVisualize";
import { UploadHeader, UploadForm } from "./upload";
import { useFileUpload } from "@/hooks/useFileUpload";

const FileUpload = () => {
  const {
    selectedFile,
    columns,
    loading,
    fileProcessing,
    uploadSuccess,
    dragActive,
    fileInputRef,
    handleFileChange,
    handleDrag,
    handleDrop,
    handleDeleteFile,
    handleUpload,
  } = useFileUpload();

  return (
    <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center p-4 animate-fade-in">
      {columns.length > 0 && selectedFile ? (
        <DataVisualize 
          file={selectedFile} 
          columns={columns} 
          onDelete={handleDeleteFile} 
        />
      ) : (
        <div className="w-full max-w-2xl">
          <UploadHeader />
          <UploadForm
            selectedFile={selectedFile}
            loading={loading}
            fileProcessing={fileProcessing}
            uploadSuccess={uploadSuccess}
            dragActive={dragActive}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onDeleteFile={handleDeleteFile}
            onUpload={handleUpload}
          />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
