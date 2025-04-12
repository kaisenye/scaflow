import React from 'react';
import Checkbox from '../ui/Checkbox';
import FileInputCell from './FileInputCell';

interface Category {
  name: string;
  color: string;
}

interface TableRowProps {
  row: string[];
  rowIndex: number;
  columnWidths: number[];
  isSelected: boolean;
  hoveredIndexCell: number | null;
  onMouseEnter: (index: number) => void;
  onMouseLeave: () => void;
  onRowSelect: (index: number) => void;
  onCellChange: (rowIndex: number, cellIndex: number, value: string) => void;
  columnData: Array<{ 
    type: string; 
    isFileInput?: boolean;
    categories?: Category[];
  }>;
  files?: (File | null)[][];
  onFileSelect?: (rowIndex: number, cellIndex: number, file: File | null) => void;
  processingCells?: Set<string>;
}

const TableRow: React.FC<TableRowProps> = ({
  row,
  rowIndex,
  columnWidths,
  isSelected,
  hoveredIndexCell,
  onMouseEnter,
  onMouseLeave,
  onRowSelect,
  onCellChange,
  columnData,
  files,
  onFileSelect,
  processingCells = new Set()
}) => {
  const renderSelectPills = (value: string, columnIndex: number) => {
    const columnType = columnData[columnIndex]?.type;
    const categories = columnData[columnIndex]?.categories || [];
    
    // Helper to find category by name
    const findCategory = (name: string) => {
      return categories.find(cat => cat.name.trim() === name.trim());
    };
    
    if (columnType === 'singleSelect') {
      // For single select, render one pill
      const category = findCategory(value);
      if (category) {
        return (
          <div className="flex h-full items-center">
            <span 
              className="text-xs rounded font-medium px-2 py-0.5 text-white truncate"
              style={{ backgroundColor: category.color }}
            >
              {value}
            </span>
          </div>
        );
      }
    } else if (columnType === 'multiSelect' && value) {
      // For multi-select, split by comma and render multiple pills
      const valueArray = value.split(',').map(v => v.trim()).filter(v => v);
      
      if (valueArray.length > 0) {
        return (
          <div className="flex h-full items-center overflow-x-auto no-scrollbar space-x-1">
            {valueArray.map((val, index) => {
              const category = findCategory(val);
              return (
                <span 
                  key={index}
                  className="text-xs rounded font-medium px-2 py-0.5 text-white whitespace-nowrap"
                  style={{ backgroundColor: category?.color || '#6B7280' }}
                >
                  {val}
                </span>
              );
            })}
          </div>
        );
      }
    }
    
    // Default: return null and let the regular input field render
    return null;
  };

  const renderCell = (cellIndex: number, cellValue: string) => {
    const cellKey = `${rowIndex}-${cellIndex}`;
    const isProcessing = processingCells.has(cellKey);
    const columnType = columnData[cellIndex]?.type;
    
    // Render a file input cell if this column is a file input
    if (columnData[cellIndex]?.isFileInput) {
      return (
        <FileInputCell
          value={cellValue}
          file={files?.[rowIndex]?.[cellIndex] || null}
          onFileSelect={(file) => onFileSelect?.(rowIndex, cellIndex, file)}
        />
      );
    }
    
    // For selection type fields, render pills instead of text input
    if ((columnType === 'singleSelect' || columnType === 'multiSelect') && cellValue) {
      const pills = renderSelectPills(cellValue, cellIndex);
      if (pills) {
        return (
          <div className="relative w-full h-full">
            {isProcessing && (
              <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {pills}
          </div>
        );
      }
    }
    
    // Render a regular editable cell
    return (
      <div className="relative w-full h-full">
        {isProcessing && (
          <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <input
          type="text"
          value={cellValue}
          onChange={(e) => onCellChange(rowIndex, cellIndex, e.target.value)}
          className={`w-full h-full bg-transparent focus:outline-none ${isProcessing ? 'opacity-50' : ''}`}
          disabled={isProcessing}
        />
      </div>
    );
  };

  return (
    <tr className={isSelected ? "bg-blue-50" : ""}>
      {/* Index/checkbox cell */}
      <td 
        className="h-[35px] w-[35px] max-h-[35px] max-w-[35px] text-[13px] border border-gray-200 p-1 whitespace-nowrap text-center relative overflow-hidden sticky left-0 bg-white z-[1]"
        onMouseEnter={() => onMouseEnter(rowIndex)}
        onMouseLeave={onMouseLeave}
      >
        {(hoveredIndexCell === rowIndex || isSelected) ? (
          <div className="flex justify-center items-center w-full h-full">
            <Checkbox 
              checked={isSelected} 
              onClick={() => onRowSelect(rowIndex)} 
            />
          </div>
        ) : (
          <span className="text-gray-500 text-xs">{rowIndex + 1}</span>
        )}
      </td>
      
      {row.map((cell, cellIndex) => (
        <td 
          key={cellIndex} 
          className="h-[35px] max-h-[35px] text-[13px] border border-gray-200 px-2 py-1 whitespace-nowrap text-left relative overflow-hidden"
          style={{ width: `${columnWidths[cellIndex]}px` }}
        >
          {renderCell(cellIndex, cell)}
        </td>
      ))}
      
      {/* Extended single cell */}
      <td className="h-[35px] border-t border-b border-r border-gray-200 relative p-1 text-[13px]"></td>
    </tr>
  );
};

export default TableRow; 