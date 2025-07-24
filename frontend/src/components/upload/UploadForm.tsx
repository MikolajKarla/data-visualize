import React from "react";
import UploadArea from "./UploadArea";
import LoadingOverlay from "./LoadingOverlay";
import UploadButton from "./UploadButton";
import CurrFile from "../CurrFile";

interface UploadFormProps {
  selectedFile: File | null;
  loading: boolean;
  fileProcessing: boolean;
  uploadSuccess: boolean;
  dragActive: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDeleteFile: () => void;
  onUpload: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({
  selectedFile,
  loading,
  fileProcessing,
  uploadSuccess,
  dragActive,
  fileInputRef,
  onFileChange,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onDeleteFile,
  onUpload,
}) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-8 shadow-lg card-hover animate-slide-up relative">
      <LoadingOverlay loading={loading || fileProcessing} isFileProcessing={fileProcessing} />
      
      <UploadArea
        dragActive={dragActive}
        loading={loading || fileProcessing}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onFileChange={onFileChange}
        fileInputRef={fileInputRef}
      />

      {/* Selected File Display */}
      {selectedFile && (
        <div className="mt-6">
          <CurrFile file={selectedFile} onDelete={onDeleteFile} />
        </div>
      )}

      <UploadButton
        uploadSuccess={uploadSuccess}
        loading={loading || fileProcessing}
        selectedFile={selectedFile}
        onUpload={onUpload}
      />
    </div>
  );
};

export default UploadForm;
