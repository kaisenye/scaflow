import React from 'react';
import { FiPlus, FiType, FiHash, FiCalendar, FiList, FiCheckSquare, FiFile } from "react-icons/fi";
import Checkbox from '../ui/Checkbox';

interface ColumnData {
  name: string;
  type: string;
  llmPrompt?: string;
  isFileInput?: boolean;
}

interface TableHeaderProps {
  columns: string[];
  columnWidths: number[];
  selectAll: boolean;
  onSelectAll: () => void;
  onAddColumn: () => void;
  onResizeStart: (e: React.MouseEvent, columnIndex: number) => void;
  resizingColumn: number | null;
  addColumnButtonRef: any;
  onColumnClick?: (index: number, event: React.MouseEvent) => void;
  columnData?: ColumnData[];
}

const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  columnWidths,
  selectAll,
  onSelectAll,
  onAddColumn,
  onResizeStart,
  resizingColumn,
  addColumnButtonRef,
  onColumnClick,
  columnData = []
}) => {
  const handleColumnClick = (index: number, e: React.MouseEvent) => {
    // Stop propagation to prevent other handlers
    e.stopPropagation();
    
    console.log('Column header clicked:', index);
    
    // Get the resize handle element
    const resizeHandle = e.currentTarget.querySelector('.resize-handle');
    
    // Check if click was on the resize handle
    if (e.target === resizeHandle || resizeHandle?.contains(e.target as Node)) {
      console.log('Click was on resize handle, ignoring');
      return;
    }

    // Otherwise, trigger the column click
    console.log('Triggering onColumnClick');
    if (onColumnClick) {
      onColumnClick(index, e);
    }
  };

  // Function to get the appropriate icon for a column type
  const getColumnTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <FiType size={12} className="mr-1" />;
      case 'number':
        return <FiHash size={12} className="mr-1" />;
      case 'timestamp':
        return <FiCalendar size={12} className="mr-1" />;
      case 'singleSelect':
        return <FiList size={12} className="mr-1" />;
      case 'multiSelect':
        return <FiCheckSquare size={12} className="mr-1" />;
      case 'file':
        return <FiFile size={12} className="mr-1" />;
      default:
        return null;
    }
  };

  return (
    <thead>
      <tr className="sticky top-0 bg-white z-[1] border-b border-gray-200">
        {/* Index/checkbox header cell */}
        <th className="h-[35px] w-[35px] max-h-[35px] max-w-[35px] text-[13px] bg-[#FBFBFB] border border-gray-200 border-r-gray-200 p-1 whitespace-nowrap text-center relative overflow-hidden z-[2]">
          <div className="flex justify-center items-center w-full h-full">
            <Checkbox checked={selectAll} onClick={onSelectAll} />
          </div>
        </th>
        
        {columns.map((col, index) => (
          <th 
            key={index} 
            className="h-[35px] max-h-[35px] text-[13px] border border-gray-200 p-2 whitespace-nowrap text-left relative overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors duration-150"
            style={{ width: `${columnWidths[index]}px` }}
            onClick={(e) => handleColumnClick(index, e)}
            data-column-index={index}
          >
            <div className="flex items-center gap-1">
              {columnData[index] && getColumnTypeIcon(columnData[index].type)}
              <span className='font-medium text-xs'>{col}</span>
            </div>
            <div
              className="absolute right-0 top-0 bottom-0 w-[5px] cursor-col-resize resize-handle"
              style={{ 
                backgroundColor: resizingColumn !== null ? '#0066ff' : 'transparent'
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                onResizeStart(e, index);
              }}
            />
          </th>
        ))}
        
        {/* Pinned header cell for "Add Column" */}
        <th 
          className="bg-white hover:bg-gray-50 transition-colors duration-200 h-[35px] w-[35px] min-w-[35px] min-h-[35px] text-xs border border-gray-200 p-1 relative z-[2] cursor-pointer"
          onClick={onAddColumn}
        >
          <button 
            ref={addColumnButtonRef}
            className="flex justify-center items-center w-full h-full cursor-pointer">
            <FiPlus size={20} />
          </button>
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader; 