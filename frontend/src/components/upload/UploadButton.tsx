import React from "react";
import { Button } from "../ui/button";
import { Upload, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface UploadButtonProps {
  uploadSuccess: boolean;
  loading: boolean;
  selectedFile: File | null;
  onUpload: () => void;
  hasAuthToken?: boolean;
}

function UploadButton({
  uploadSuccess,
  loading,
  selectedFile,
  onUpload,
  hasAuthToken = true,
}: UploadButtonProps) {
  
  const handleUploadClick = () => {
    if (!hasAuthToken) {
      toast.error("Please sign in to upload files");
      return;
    }
    onUpload();
  };
  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      {/* Upload Button */}
      {!uploadSuccess && (
        <Button
          className="px-8 py-3 h-12 text-base font-medium rounded-xl shadow-lg transition-all duration-300"
          onClick={handleUploadClick}
          disabled={!selectedFile || loading}
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Uploading file...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Upload File
            </>
          )}
        </Button>
      )}
    </div>
  );
}

export default UploadButton;
