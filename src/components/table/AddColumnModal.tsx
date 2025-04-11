import React, { ReactNode, useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { FiChevronDown, FiPlus, FiX } from 'react-icons/fi';
    
// Define column type interface inline
interface ColumnType {
  id: string;
  name: string;
  icon: ReactNode;
}

interface Category {
  name: string;
  color: string;
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
  categories?: Category[];
  onCategoriesChange?: (categories: Category[]) => void;
}

// Predefined colors for categories
const categoryColors = [
  "#EF4444", // Red
  "#F97316", // Orange
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#06B6D4", // Cyan
  "#3B82F6", // Blue
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#6B7280", // Gray
  "#1F2937", // Dark Gray
];

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
  onLlmPromptChange = () => {},
  categories = [],
  onCategoriesChange = () => {}
}) => {
  if (!show) return null;

  const modalRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [localCategories, setLocalCategories] = useState<Category[]>(categories);
  
  // Memoize the callback to prevent it changing between renders
  // const memoizedLlmPromptChange = useCallback(onLlmPromptChange, []);
  
  // Set initial categories when modal first shows
  useEffect(() => {
    if (show) {
      setLocalCategories(categories);
    }
  }, [show, categories]);
  
  // Update prompt when categories change logic needs to be removed
  const updatePrompt = useCallback(() => {
    // No automated modification of user's prompt
    // We'll show the categories below the input instead
  }, []);
  
  // Remove the automatic prompt update effect
  useEffect(() => {
    // No automatic prompt update
  }, [updatePrompt]);
  
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
  
  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Calculate position based on the button reference
  const buttonRect = buttonRef.current?.getBoundingClientRect();
  
  // Filter out file type
  const filteredColumnTypes = columnTypes.filter(type => type.id !== 'file');
  
  // Find the currently selected type for display
  const selectedType = filteredColumnTypes.find(type => type.id === selectedColumnType);
  
  // Function to get a random color from the category colors
  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * categoryColors.length);
    return categoryColors[randomIndex];
  };
  
  // Handle adding a new category - now with random color
  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    
    const newCat = {
      name: newCategory.trim(),
      color: getRandomColor()
    };
    
    const updatedCategories = [...localCategories, newCat];
    setLocalCategories(updatedCategories);
    onCategoriesChange(updatedCategories);
    setNewCategory("");
    
    console.log("Category added:", newCat, "Total categories:", updatedCategories.length);
  };
  
  // Handle key press in the category input
  const handleCategoryKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newCategory.trim()) {
      e.preventDefault();
      handleAddCategory();
    }
  };
  
  // Handle removing a category
  const handleRemoveCategory = (index: number) => {
    const updatedCategories = [...localCategories];
    updatedCategories.splice(index, 1);
    setLocalCategories(updatedCategories);
    onCategoriesChange(updatedCategories);
  };
  
  // Handle changing a category's color
  const handleChangeColor = (index: number) => {
    const updatedCategories = [...localCategories];
    updatedCategories[index].color = getRandomColor();
    setLocalCategories(updatedCategories);
    onCategoriesChange(updatedCategories);
  };
  
  // Check if current type is a selection type
  const isSelectionType = selectedColumnType === 'singleSelect' || selectedColumnType === 'multiSelect';
  
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
          className="w-full p-2 border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-blue-200"
          autoFocus
        />
      </div>
      
      <div className="mb-4">
        <h3 className="text-xs font-medium mb-2 text-gray-600">DATA TYPE</h3>
        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center justify-between p-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-50"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="flex items-center">
              {selectedType && (
                <div className="flex items-center justify-center w-5 h-5 mr-3 border border-gray-300 bg-gray-100 rounded">
                  {selectedType.icon}
                </div>
              )}
              <span className="text-xs">{selectedType?.name || "Select a type"}</span>
            </div>
            <FiChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`} />
          </div>
          
          {dropdownOpen && (
            <div className="absolute top-0 left-full mt-0 ml-2 z-20 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
              {filteredColumnTypes.map((type) => (
                <div
                  key={type.id}
                  className={`flex items-center p-2 text-sm cursor-pointer hover:bg-gray-50 ${
                    selectedColumnType === type.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    onColumnTypeSelect(type.id);
                    setDropdownOpen(false);
                  }}
                >
                  <div className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 bg-gray-100 rounded">
                    {type.icon}
                  </div>
                  <span className="text-xs">{type.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Category Management - Only for single/multi select */}
      {isSelectionType && (
        <div className="mb-4">
          <h3 className="text-xs font-medium mb-2 text-gray-600">SELECTIONS</h3>
          
          {/* Add new category - now with Enter key handling */}
          <div className="flex mb-2">
            <div className="flex-1">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={handleCategoryKeyPress}
                placeholder="Add category"
                className="w-full p-2 border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-blue-200"
              />
            </div>
          </div>
          
          {/* Category list - with clickable color dots to change colors */}
          <div className="space-y-1 max-h-32 overflow-y-auto rounded p-1">
            {localCategories.length > 0 ? (
              localCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between text-xs p-1 hover:bg-gray-50 rounded">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded mr-2 cursor-pointer hover:opacity-80"
                      style={{ backgroundColor: category.color }}
                      onClick={() => handleChangeColor(index)}
                      title="Click to change color"
                    ></div>
                    <span>{category.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => handleRemoveCategory(index)}
                  >
                    <FiX size={10} />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-xs text-gray-400 p-2 text-center">No categories added yet</div>
            )}
          </div>
        </div>
      )}
      
      {/* LLM Prompt Section - Always visible */}
      <div className="mb-4">
        <h3 className="text-xs font-medium mb-2 text-gray-600">PROMPT</h3>
        <textarea
          value={llmPrompt}
          onChange={(e) => onLlmPromptChange(e.target.value)}
          className="w-full p-2 bg-gray-100 text-xs focus:outline-none min-h-[80px] resize-vertical"
          placeholder="Prompt..."
        />
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