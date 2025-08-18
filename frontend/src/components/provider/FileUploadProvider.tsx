import React, { createContext, useContext, ReactNode } from "react";
import { useFileUpload } from "@/hooks/useFileUpload";

type FileUploadContextType = ReturnType<typeof useFileUpload>;

const FileUploadContext = createContext<FileUploadContextType | undefined>(undefined);

interface FileUploadProviderProps {
  children: ReactNode;
}

export const FileUploadProvider: React.FC<FileUploadProviderProps> = ({ children }) => {
  const fileUploadState = useFileUpload();
  
  return (
    <FileUploadContext.Provider value={fileUploadState}>
      {children}
    </FileUploadContext.Provider>
  );
};

export const useFileUploadContext = () => {
  const context = useContext(FileUploadContext);
  if (context === undefined) {
    throw new Error('useFileUploadContext must be used within a FileUploadProvider');
  }
  return context;
};
