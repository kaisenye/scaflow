import React, { ReactNode, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
    
// Define column type interface inline
interface ColumnType {
  id: string;
  name: string;
  icon: ReactNode;
}

interface AddColumnModalProps {
  show: boolean;
  buttonRef: any; // Using any for simplicity 
  columnTypes: ColumnType[];
  selectedColumnType: string;
  newColumnName: string;
  onColumnNameChange: (name: string) => void;
  onColumnTypeSelect: (typeId: string) => void;
  onCancel: () => void;
  onAdd: () => void;
  llmPrompt?: string;
  onLlmPromptChange?: (prompt: string) => void;
}

const AddColumnModal: React.FC<AddColumnModalProps> = ({
  show,
  buttonRef,
  columnTypes,
  selectedColumnType,
  newColumnName,
  onColumnNameChange,
  onColumnTypeSelect,
  onCancel,
  onAdd,
  llmPrompt = "",
  onLlmPromptChange = () => {}
}) => {
  if (!show) return null;

  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle outside clicks to close the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If click is outside the modal and not on the button that opened it
      if (
        modalRef.current && 
        !modalRef.current.contains(event.target as Node) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        onCancel();
      }
    };
    
    // Add event listener when the modal is shown
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup the event listener when component unmounts or modal is hidden
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [buttonRef, onCancel]);

  // Calculate position based on the button reference
  const buttonRect = buttonRef.current?.getBoundingClientRect();
  
  // Filter out file type
  const filteredColumnTypes = columnTypes.filter(type => type.id !== 'file');
  
  return (
    <div 
      ref={modalRef}
      className="absolute z-[100] w-[300px] bg-white border border-gray-200 rounded-lg shadow-md p-4"
      style={{
        top: buttonRect ? `${buttonRect.bottom + 5}px` : '0',
        left: buttonRect ? `${buttonRect.left - 480}px` : '0',
      }}
    >
      <div className="mb-4">
        <h3 className="text-xs font-medium mb-2 text-gray-600">NAME</h3>
        <input
          type="text"
          value={newColumnName}
          onChange={(e) => onColumnNameChange(e.target.value)}
          className="w-full p-2 border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-200"
          autoFocus
        />
      </div>
      
      {/* LLM Prompt Section - Always visible */}
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
          onClick={onAdd}
        >
          Add Column
        </Button>
      </div>
    </div>
  );
};

export default AddColumnModal; 