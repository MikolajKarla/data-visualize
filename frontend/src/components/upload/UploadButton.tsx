import React from "react";
import { Button } from "../ui/button";
import { Upload, Loader2, CheckCircle } from "lucide-react";

interface UploadButtonProps {
  uploadSuccess: boolean;
  loading: boolean;
  selectedFile: File | null;
  onUpload: () => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  uploadSuccess,
  loading,
  selectedFile,
  onUpload,
}) => {
  return (
    <div className="mt-8 flex justify-center">
      {uploadSuccess ? (
        <div className="flex items-center gap-3 text-primary animate-scale-in">
          <CheckCircle className="w-6 h-6 text-primary" />
          <span className="font-medium">File uploaded successfully!</span>
        </div>
      ) : (
        <Button
          className="px-8 py-3 h-12 text-base font-medium rounded-xl shadow-lg transition-all duration-300"
          onClick={onUpload}
          disabled={!selectedFile || loading}
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing file...
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
};

export default UploadButton;
