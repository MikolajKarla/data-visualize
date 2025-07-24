import React from "react";
import { FileText } from "lucide-react";

const UploadHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
        <FileText className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Upload Your Data
      </h1>
      <p className="text-muted-foreground text-lg">
        Upload your CSV file to start creating beautiful visualizations
      </p>
    </div>
  );
};

export default UploadHeader;
