import React, { ReactNode, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

// Define column type interface inline
interface ColumnType {
  id: string;
  name: string;
  icon: ReactNode;
}

interface EditColumnModalProps {
  show: boolean;
  columnIndex: number;
  position: { top: number; left: number };
  columnTypes: ColumnType[];
  selectedColumnType: string;
  columnName: string;
  onColumnNameChange: (name: string) => void;
  onColumnTypeSelect: (typeId: string) => void;
  onCancel: () => void;
  onSave: () => void;
  llmPrompt?: string;
  onLlmPromptChange?: (prompt: string) => void;
  isFileColumn?: boolean;
}

const EditColumnModal: React.FC<EditColumnModalProps> = ({
  show,
  columnIndex,
  position,
  columnTypes,
  selectedColumnType,
  columnName,
  onColumnNameChange,
  onColumnTypeSelect,
  onCancel,
  onSave,
  llmPrompt = "",
  onLlmPromptChange = () => {},
  isFileColumn = false
}) => {
  if (!show) return null;
  
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle outside clicks to close the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };
    
    // Add event listener when the modal is shown
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup the event listener when component unmounts or modal is hidden
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCancel]);
  
  // Log visibility for debugging
  useEffect(() => {
    if (show) {
      console.log('Edit modal shown', { position, columnIndex });
    }
  }, [show, position, columnIndex]);
  
  // Filter column types to exclude 'file' type for non-file columns
  const filteredColumnTypes = isFileColumn 
    ? [] // Empty for file columns as we don't show type selection
    : columnTypes.filter(type => type.id !== 'file');
  
  return (
    <div 
      ref={modalRef}
      className="absolute z-[100] w-[300px] bg-white border border-gray-200 rounded-lg shadow-md p-4"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Edit Column</h3>
        <span className="text-xs text-gray-500">Col. {columnIndex + 1}</span>
      </div>
      
      <div className="mb-4">
        <h3 className="text-xs font-medium mb-2 text-gray-600">NAME</h3>
        <input
          type="text"
          value={columnName}
          onChange={(e) => onColumnNameChange(e.target.value)}
          className="w-full p-2 border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-200"
          autoFocus
        />
      </div>
      
      {/* LLM Prompt Section - Only show for non-file columns */}
      {!isFileColumn && (
        <div className="mb-4">
          <h3 className="text-xs font-medium mb-2 text-gray-600">PROMPT</h3>
          <p className="text-xs text-gray-500 mb-2">
            Define a prompt for generating content in this column.
          </p>
          <textarea
            value={llmPrompt}
            onChange={(e) => onLlmPromptChange(e.target.value)}
            className="w-full p-2 border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-200 min-h-[80px] resize-vertical"
            placeholder="E.g., Generate a concise summary of the PDF file in one paragraph."
          />
        </div>
      )}
      
      {/* Type Selection - Only show for non-file columns */}
      {!isFileColumn && (
        <div className="mb-4">
          <h3 className="text-xs font-medium mb-2 text-gray-600">DATA TYPE</h3>
          <div className="grid grid-cols-1 gap-2 text-xs">
            {filteredColumnTypes.map((type) => (
              <div
                key={type.id}
                className={`flex items-center p-2 rounded cursor-pointer hover:bg-gray-50 ${
                  selectedColumnType === type.id ? 'bg-blue-50 border border-blue-200' : 'border border-gray-200'
                } transition-colors duration-200`}
                onClick={() => onColumnTypeSelect(type.id)}
              >
                <div className="flex items-center justify-center w-6 h-6 mr-3 border border-gray-300 bg-gray-100 rounded">
                  {type.icon}
                </div>
                <span>{type.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="outline"
          className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="default"
          className="px-3 py-1 text-xs text-white rounded"
          onClick={onSave}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditColumnModal; 