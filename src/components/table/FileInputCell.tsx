import React, { useRef, useState } from 'react';
import { FiFile, FiX, FiUpload } from 'react-icons/fi';

interface FileInputCellProps {
  value: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

const FileInputCell: React.FC<FileInputCellProps> = ({ value, file, onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hover, setHover] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    onFileSelect(selectedFile);
    
    // Reset the input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
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
        className="hidden"
      />
      
      {file ? (
        <>
          <div className="flex items-center flex-1 overflow-hidden">
            <FiFile className="text-blue-500 mr-2 flex-shrink-0" size={16} />
            <span className="text-xs font-medium text-gray-600 truncate flex-1" title={file.name}>
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
          <FiUpload className="mr-2" size={14} />
          <span className="text-xs">Select a file</span>
        </div>
      )}
    </div>
  );
};

export default FileInputCell; 