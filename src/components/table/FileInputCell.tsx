import React, { useRef, useState } from 'react';
import { FiFile, FiX, FiUpload, FiImage } from 'react-icons/fi';

interface FileInputCellProps {
  value: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

const FileInputCell: React.FC<FileInputCellProps> = ({ value, file, onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hover, setHover] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    
    // Check if a file was selected
    if (selectedFile) {
      // Validate that it's an image file
      if (!selectedFile.type.startsWith('image/')) {
        setError('Only image files are supported (JPEG, PNG, etc.)');
        return;
      }
      setError(null);
    }
    
    onFileSelect(selectedFile);
    
    // Reset the input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(null);
    onFileSelect(null);
  };

  // Function to get file icon based on file type
  const getFileIcon = () => {
    if (!file) return <FiUpload size={14} />;
    
    if (file.type.startsWith('image/')) {
      return <FiImage className="text-green-500" size={16} />;
    }
    
    return <FiFile className="text-blue-500" size={16} />;
  };

  return (
    <div 
      className={`flex items-center w-fit h-full py-1 px-2 cursor-pointer rounded ${hover ? 'bg-gray-100' : 'bg-gray-50'}`}
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*" // Restrict to image files
        className="hidden"
      />
      
      {file ? (
        <>
          <div className="flex items-center flex-1 overflow-hidden">
            {getFileIcon()}
            <span className="text-xs font-medium text-gray-600 truncate ml-2 flex-1" title={file.name}>
              {file.name}
            </span>
          </div>
          <button 
            className="ml-1 text-gray-400 hover:text-gray-600 flex-shrink-0 cursor-pointer"
            onClick={handleRemoveFile}
          >
            <FiX size={16} />
          </button>
        </>
      ) : (
        <div className="flex items-center justify-center w-fit text-gray-400 gap-2">
          <FiImage className="mr-1" size={14} />
          <span className="text-xs">Select an image</span>
        </div>
      )}
      
      {error && (
        <div className="absolute top-full left-0 right-0 bg-red-50 text-red-500 text-xs p-1 border border-red-200 rounded z-10">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileInputCell; 