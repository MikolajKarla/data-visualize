"use client";
import React, { useState, useRef } from "react";
import DataVisualize from "./DataVisualize";
import CurrFile from "./CurrFile";
import { Button } from "./ui/button";
// TODO: podawac dalej jedynie nazwe pliku i zczytywac go z folderu uploads
// TODO: nie da sie podac drugiego csva


const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
      console.log(selectedFile);
      
    }
  };

  const handleDeleteFile = () => {
    console.log("deleting file");
    
    setSelectedFile(null);
    console.log(selectedFile);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true); // Start loading state

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

      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex flex-col h-[85vh] my-2 items-center justify-center ">
      {columns.length > 0 && selectedFile ?  ( // Show uploaded columns
        <DataVisualize file={selectedFile} columns={columns} onDelete={handleDeleteFile} />
      ) : ( // Show upload form
        <div className="bg-gray-600 dark:bg-gray-900 p-6 rounded-lg shadow-lg w-1/2 text-center mt-20">
          <h2 className="text-xl font-semibold text-white">Upload your file</h2>

          <label
            htmlFor="file-upload"
            className="mt-4 flex flex-col items-center justify-center p-6 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700 transition-all"
          >
            <span className="mt-2 text-gray-300">Click or drag a file to upload</span>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </label>

          {selectedFile? (<CurrFile file={selectedFile}  onDelete={handleDeleteFile} />): null}

          {/* Upload Button */}
          <Button
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
            onClick={handleUpload}
            disabled={loading} // Disable button while uploading
          >
            {loading ? "Uploading..." : "Upload File"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
