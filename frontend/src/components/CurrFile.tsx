import React from 'react';
import { Button } from './ui/button';
import { FileText, Trash2 } from 'lucide-react';

interface CurrFileProps {
  file: File;
  onDelete: () => void;
}

const CurrFile: React.FC<CurrFileProps> = ({ file, onDelete }) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-accent/30 border border-border rounded-xl p-4 transition-all duration-300 hover:bg-accent/40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground truncate max-w-[200px]">
              {file.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatFileSize(file.size)}
            </p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
          onClick={onDelete}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

export default CurrFile;