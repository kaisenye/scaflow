import React from 'react';
import Checkbox from './Checkbox';
import FileInputCell from './FileInputCell';

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
  columnData: Array<{ type: string; isFileInput?: boolean }>;
  files?: (File | null)[][];
  onFileSelect?: (rowIndex: number, cellIndex: number, file: File | null) => void;
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
}) => {
  // Render a cell based on column type
  const renderCell = (cellIndex: number, value: string) => {
    const column = columnData[cellIndex];
    
    if (column?.isFileInput && onFileSelect) {
      return (
        <FileInputCell
          value={value}
          file={files?.[rowIndex]?.[cellIndex] || null}
          onFileSelect={(file: File | null) => onFileSelect(rowIndex, cellIndex, file)}
        />
      );
    }
    
    // Default text input for other cell types
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onCellChange(rowIndex, cellIndex, e.target.value)}
        className="w-full h-full border-none outline-none bg-transparent"
      />
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
          className="h-[35px] max-h-[35px] text-[13px] border border-gray-200 p-1 whitespace-nowrap text-left relative overflow-hidden"
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