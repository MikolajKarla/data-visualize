import React from 'react'
import { Button } from './ui/button';

interface CurrFileProps {
    file: File;
    onDelete: () => void;
  }

const CurrFile: React.FC<CurrFileProps> =({file, onDelete})=> {
  return (
    <div className="flex  items-center justify-center text-center gap-4 bg-gray-800 p-4 rounded-lg w-full">
    {/* File Information */}
    <div className="text-white text-center">
      <h2 className="text-lg font-semibold">File Name: {file.name}</h2>
      <p className="text-sm text-gray-400">Size: {(file.size / 1000).toFixed(2)} kB</p>
    </div>

    {/* Delete Button */}
    <Button className="bg-red-600 text-white hover:bg-red-700 transition-all" onClick={onDelete}>
      Delete
    </Button>
  </div>
  )
}

export default CurrFile