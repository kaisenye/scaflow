"use client";

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { FiPlus, FiType, FiHash, FiCalendar, FiList, FiCheckSquare, FiFile } from "react-icons/fi";
import { Button } from '@/components/ui/button';
import AddColumnModal from './AddColumnModal';
import EditColumnModal from './EditColumnModal';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import openaiService from '@/services/openai';

// Define column type interface inline
interface ColumnType {
  id: string;
  name: string;
  icon: ReactNode;
}

interface ColumnData {
  name: string;
  type: string;
  llmPrompt?: string;
  isFileInput?: boolean;
}

const columnTypes: ColumnType[] = [
  { id: 'text', name: 'Text', icon: <FiType size={12} /> },
  { id: 'number', name: 'Number', icon: <FiHash size={12} /> },
  { id: 'timestamp', name: 'Timestamp', icon: <FiCalendar size={12} /> },
  { id: 'singleSelect', name: 'Single Select', icon: <FiList size={12} /> },
  { id: 'multiSelect', name: 'Multi Select', icon: <FiCheckSquare size={12} /> },
  { id: 'file', name: 'File', icon: <FiFile size={12} /> },
];

const Table: React.FC = () => {
  // Initial table layout: one column for file input and two rows
  const initialColumns = ['Files'];
  const initialRows = [
    [''], // Empty value for file input cells
    [''],
  ];

  // State for header (columns) and body (rows)
  const [columns, setColumns] = useState<string[]>(initialColumns);
  
  // Track column data including type and LLM prompt
  const [columnData, setColumnData] = useState<ColumnData[]>([
    { name: 'Files', type: 'file', isFileInput: true, llmPrompt: '' }
  ]);
  
  const [rows, setRows] = useState<string[][]>(initialRows);
  const [files, setFiles] = useState<(File | null)[][]>(initialRows.map(() => Array(initialColumns.length).fill(null)));

  // State for selected rows
  const [selectedRows, setSelectedRows] = useState<boolean[]>(initialRows.map(() => false));
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [hoveredIndexCell, setHoveredIndexCell] = useState<number | null>(null);

  // State for column type selection modal (new column)
  const [showAddColumnModal, setShowAddColumnModal] = useState<boolean>(false);
  const [newColumnName, setNewColumnName] = useState<string>('');
  const [selectedColumnType, setSelectedColumnType] = useState<string>('text');
  const [newColumnLlmPrompt, setNewColumnLlmPrompt] = useState<string>('');
  
  // State for edit column modal
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editColumnIndex, setEditColumnIndex] = useState<number>(-1);
  const [editColumnName, setEditColumnName] = useState<string>('');
  const [editColumnType, setEditColumnType] = useState<string>('text');
  const [editColumnLlmPrompt, setEditColumnLlmPrompt] = useState<string>('');
  const [editModalPosition, setEditModalPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  
  // Reference for the add column button to position the modal
  const addColumnButtonRef = useRef<HTMLButtonElement>(null);

  // Column resizing state
  const [columnWidths, setColumnWidths] = useState<number[]>([250]); // Wider for file column
  const [resizingColumn, setResizingColumn] = useState<number | null>(null);
  const [startX, setStartX] = useState<number>(0);
  const [startWidth, setStartWidth] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Ref to the scrollable container.
  const containerRef = useRef<HTMLDivElement>(null);
  // Refs to hold scroll positions for restoration.
  const scrollTopRef = useRef<number | null>(null);
  const scrollLeftRef = useRef<number | null>(null);
  
  // Ref for the table element to set its width
  const tableRef = useRef<HTMLTableElement>(null);
  
  // State for tracking processing status
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStatus, setProcessingStatus] = useState<{
    total: number,
    completed: number,
    current: { row: number, col: number } | null
  }>({ total: 0, completed: 0, current: null });
  
  // State to track all cells currently being processed
  const [processingCells, setProcessingCells] = useState<Set<string>>(new Set());

  // Calculate and update table width whenever column widths change
  useEffect(() => {
    if (tableRef.current) {
      const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0) + 35 + 35; // sum of all column widths + checkbox column + add column button
      tableRef.current.style.minWidth = `${totalWidth}px`;
    }
  }, [columnWidths]);

  // Function to handle file selection
  const handleFileSelect = (rowIndex: number, cellIndex: number, file: File | null) => {
    // Update files state
    setFiles(prevFiles => {
      const newFiles = [...prevFiles];
      if (!newFiles[rowIndex]) {
        newFiles[rowIndex] = [];
      }
      newFiles[rowIndex][cellIndex] = file;
      return newFiles;
    });
    
    // Update the text value in rows (filename or empty)
    setRows(prevRows => {
      const newRows = [...prevRows];
      newRows[rowIndex][cellIndex] = file ? file.name : '';
      return newRows;
    });
  };

  // After each update to rows or columns, restore scroll positions.
  useEffect(() => {
    if (containerRef.current) {
      if (scrollTopRef.current !== null) {
        containerRef.current.scrollTop = scrollTopRef.current;
        scrollTopRef.current = null;
      }
      if (scrollLeftRef.current !== null) {
        containerRef.current.scrollLeft = scrollLeftRef.current;
        scrollLeftRef.current = null;
      }
    }
  }, [rows, columns]);

  // Update container width when resizing
  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    
    return () => {
      window.removeEventListener('resize', updateContainerWidth);
    };
  }, []);

  // Resizing handlers
  const handleResizeStart = (e: React.MouseEvent, columnIndex: number) => {
    e.preventDefault();
    setResizingColumn(columnIndex);
    setStartX(e.pageX);
    setStartWidth(columnWidths[columnIndex]);
    
    // Save current scroll position
    if (containerRef.current) {
      scrollLeftRef.current = containerRef.current.scrollLeft;
    }
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (resizingColumn === null) return;
    const diff = e.pageX - startX;
    const newWidth = Math.max(50, startWidth + diff);
    setColumnWidths((prev) => {
      const newWidths = [...prev];
      newWidths[resizingColumn] = newWidth;
      return newWidths;
    });
  };

  const handleResizeEnd = () => {
    setResizingColumn(null);
    
    // Restore scroll position after resize is complete
    if (containerRef.current && scrollLeftRef.current !== null) {
      containerRef.current.scrollLeft = scrollLeftRef.current;
      scrollLeftRef.current = null;
    }
  };

  useEffect(() => {
    if (resizingColumn !== null) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [resizingColumn, startX, startWidth]);

  // Row selection handlers
  const toggleRowSelection = (rowIndex: number) => {
    setSelectedRows(prev => {
      const newSelected = [...prev];
      newSelected[rowIndex] = !newSelected[rowIndex];
      return newSelected;
    });
  };

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setSelectedRows(Array(rows.length).fill(newSelectAll));
  };

  // When adding a new row, also add its selection state
  useEffect(() => {
    if (selectedRows.length !== rows.length) {
      setSelectedRows(prev => {
        const newSelected = [...prev];
        while (newSelected.length < rows.length) {
          newSelected.push(false);
        }
        return newSelected;
      });
    }
  }, [rows.length, selectedRows.length]);

  // Handlers for adding rows and columns.
  const handleAddRow = () => {
    if (containerRef.current) {
      scrollTopRef.current = containerRef.current.scrollTop;
    }
    
    // Create a new row with empty cells (first cell is for file input)
    const newRow = columns.map(() => '');
    setRows((prev) => [...prev, newRow]);
    
    // Also update files state with null for the new row
    setFiles(prev => {
      const newFiles = [...prev];
      newFiles.push(Array(columns.length).fill(null));
      return newFiles;
    });
  };

  // Modified handleAddColumn to show modal first
  const handleAddColumn = () => {
    setShowAddColumnModal(!showAddColumnModal);
    setNewColumnName(`Column ${columns.length + 1}`);
  };

  // Function to add the new column with type and LLM prompt
  const addNewColumn = () => {
    if (containerRef.current) {
      scrollLeftRef.current = containerRef.current.scrollLeft;
    }
    
    // Get current total width
    const currentTotalWidth = columnWidths.reduce((sum, width) => sum + width, 0);
    
    // Add the new column
    setColumns((prev) => [...prev, newColumnName]);
    setColumnData((prev) => [...prev, { 
      name: newColumnName, 
      type: selectedColumnType,
      llmPrompt: newColumnLlmPrompt,
      isFileInput: selectedColumnType === 'file'
    }]);
    
    // Add width for the new column
    const newColumnWidth = selectedColumnType === 'file' ? 250 : 200;
    setColumnWidths((prev) => [...prev, newColumnWidth]);
    
    // Update rows with empty values for the new column
    setRows((prevRows) => prevRows.map((row) => [...row, '']));
    
    // Update files with null for the new column if it's a file type
    if (selectedColumnType === 'file') {
      setFiles(prev => prev.map(row => [...row, null]));
    }
    
    // Close the modal and reset state
    setShowAddColumnModal(false);
    setSelectedColumnType('text');
    setNewColumnLlmPrompt('');
    
    // Scroll to show the new column (after react updates the DOM)
    setTimeout(() => {
      if (containerRef.current) {
        const newTotalWidth = currentTotalWidth + newColumnWidth;
        containerRef.current.scrollLeft = newTotalWidth;
      }
    }, 0);
  };

  // Handler for cell value changes
  const handleCellChange = (rowIndex: number, cellIndex: number, value: string) => {
    // Only update text cells, not file input cells
    if (!columnData[cellIndex]?.isFileInput) {
      setRows((prevRows) => {
        const newRows = [...prevRows];
        newRows[rowIndex][cellIndex] = value;
        return newRows;
      });
    }
  };

  // Handler for column header click
  const handleColumnClick = (index: number, event: React.MouseEvent) => {
    // Get the clicked column header element
    const columnHeader = event.currentTarget as HTMLElement;
    const rect = columnHeader.getBoundingClientRect();
    
    // Get the table container position
    const containerRect = containerRef.current?.getBoundingClientRect() || { top: 0, left: 0 };
    
    // Calculate position for the edit modal
    // We use the scroll position of the container to adjust for scrolling
    const scrollLeft = containerRef.current?.scrollLeft || 0;
    
    // Set position for the edit modal - absolute position relative to the table container
    setEditModalPosition({
      top: rect.bottom - containerRect.top, // Position below the header
      left: rect.left - containerRect.left + scrollLeft, // Align with left edge of header
    });
    
    console.log('Column clicked:', index, 'Position:', {
      top: rect.bottom - containerRect.top,
      left: rect.left - containerRect.left + scrollLeft,
    });
    
    // Set the edit column details
    setEditColumnIndex(index);
    setEditColumnName(columnData[index].name);
    setEditColumnType(columnData[index].type);
    setEditColumnLlmPrompt(columnData[index].llmPrompt || '');
    
    // Show the modal
    setShowEditModal(!showEditModal);
  };

  // Handler for saving edited column
  const saveEditedColumn = () => {
    if (editColumnIndex < 0) return;
    
    const isOriginalFileType = columnData[editColumnIndex].isFileInput;
    // For file columns, always keep the type as 'file' regardless of UI selection
    const finalType = isOriginalFileType ? 'file' : editColumnType;
    const isFileType = finalType === 'file';
    const wasFileType = columnData[editColumnIndex].isFileInput;
    
    // Update column name and data
    setColumns((prev) => {
      const newColumns = [...prev];
      newColumns[editColumnIndex] = editColumnName;
      return newColumns;
    });
    
    setColumnData((prev) => {
      const newData = [...prev];
      newData[editColumnIndex] = { 
        name: editColumnName, 
        type: finalType,
        llmPrompt: editColumnLlmPrompt,
        isFileInput: isFileType
      };
      return newData;
    });
    
    // If column type changed to/from file, update the files state
    if (isFileType !== wasFileType) {
      if (isFileType) {
        // Changed to file type, initialize file array
        setFiles(prev => {
          const newFiles = [...prev];
          rows.forEach((_, rowIndex) => {
            if (!newFiles[rowIndex]) {
              newFiles[rowIndex] = [];
            }
            newFiles[rowIndex][editColumnIndex] = null;
          });
          return newFiles;
        });
      }
    }
    
    // Close the modal
    setShowEditModal(false);
  };

  // Function to validate if a file is an image
  const isImageFile = (file: File | null): boolean => {
    if (!file) return false;
    return file.type.startsWith('image/');
  };

  // Function to run the LLM engine on all cells
  const runLlmEngine = async () => {
    // Check if there are any files to process
    const hasFiles = files.some(row => row.some(file => file !== null));
    if (!hasFiles) {
      alert('No image files found. Please upload at least one image file before running the engine.');
      return;
    }

    setIsProcessing(true);
    // Clear processing cells set
    setProcessingCells(new Set());
    
    // Prepare a list of all cells to process
    type CellToProcess = {
      rowIndex: number;
      colIndex: number;
      imageFile: File;
      prompt: string;
      type: string;
    };
    
    const cellsToProcess: CellToProcess[] = [];
    
    // Find all cells that need processing
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      // Get the file for this row (should be in the first column)
      const fileColumn = columnData.findIndex(col => col.isFileInput);
      if (fileColumn === -1) continue;
      
      const imageFile = files[rowIndex]?.[fileColumn];
      if (!imageFile || !isImageFile(imageFile)) continue;
      
      // Find all non-file columns with prompts
      for (let colIndex = 0; colIndex < columnData.length; colIndex++) {
        const col = columnData[colIndex];
        
        // Skip file input columns and columns without prompts
        if (col.isFileInput || !col.llmPrompt) continue;
        
        cellsToProcess.push({
          rowIndex,
          colIndex,
          imageFile,
          prompt: col.llmPrompt || '',
          type: col.type
        });
      }
    }
    
    // Set initial processing status
    setProcessingStatus({
      total: cellsToProcess.length,
      completed: 0,
      current: null
    });
    
    if (cellsToProcess.length === 0) {
      setIsProcessing(false);
      alert('No cells to process. Please add columns with prompts.');
      return;
    }
    
    // Process cells in batches of 3
    const batchSize = 3;
    let completedCells = 0;
    
    // Process in batches
    for (let i = 0; i < cellsToProcess.length; i += batchSize) {
      const batch = cellsToProcess.slice(i, i + batchSize);
      
      // Update the current cells being processed
      const cellKeys = new Set<string>();
      batch.forEach(cell => {
        const cellKey = `${cell.rowIndex}-${cell.colIndex}`;
        cellKeys.add(cellKey);
      });
      
      // Update all cells that are currently being processed
      setProcessingCells(prevCells => {
        const newCells = new Set(prevCells);
        cellKeys.forEach(key => newCells.add(key));
        return newCells;
      });
      
      // Update status for UI display
      if (batch.length > 0) {
        setProcessingStatus(prev => ({
          ...prev,
          current: { row: batch[0].rowIndex, col: batch[0].colIndex }
        }));
      }
      
      // Process batch in parallel
      const results = await Promise.all(
        batch.map(cell => 
          openaiService.analyzeImage({
            imageFile: cell.imageFile,
            prompt: cell.prompt,
            type: cell.type
          })
          .then(result => ({ result, cell }))
          .catch(error => ({ 
            result: { content: '', error: error instanceof Error ? error.message : 'Unknown error' },
            cell 
          }))
        )
      );
      
      // Update UI with results
      results.forEach(({ result, cell }) => {
        const { rowIndex, colIndex } = cell;
        const cellKey = `${rowIndex}-${colIndex}`;
        
        // Remove from processing cells
        setProcessingCells(prevCells => {
          const newCells = new Set(prevCells);
          newCells.delete(cellKey);
          return newCells;
        });
        
        // Update the cell with the result
        if (!result.error) {
          setRows(prevRows => {
            const newRows = [...prevRows];
            newRows[rowIndex][colIndex] = result.content;
            return newRows;
          });
        } else {
          console.error(`Error processing cell (${rowIndex}, ${colIndex}):`, result.error);
        }
        
        // Update completed count
        completedCells++;
        setProcessingStatus(prev => ({
          ...prev,
          completed: completedCells
        }));
      });
    }
    
    // Reset processing state when done
    setIsProcessing(false);
    setProcessingCells(new Set());
    setProcessingStatus({
      total: 0,
      completed: 0,
      current: null
    });
  };

  return (
    <div className="size-full bg-gray-100">
      {/* Page header */}
      <div className="flex justify-between items-center py-2 px-4">
        <div className="text-base font-bold">Main Table</div>
        <div className="flex items-center gap-2 text-sm">
          <button className="bg-gray-100 px-2 py-1 rounded-sm">Share</button>
          <button className="bg-gray-100 px-2 py-1 rounded-sm">Download</button>
          <Button 
            variant="default" 
            className="px-2 py-0 rounded-sm" 
            size="sm"
            onClick={runLlmEngine}
            disabled={isProcessing}
          >
            {isProcessing ? 
              `Processing ${processingStatus.completed}/${processingStatus.total}...` : 
              'Run Engine'
            }
          </Button>
        </div>
      </div>
      
      {/* Scrollable container */}
      <div 
        ref={containerRef} 
        className="relative w-full h-[85%] overflow-auto border border-gray-200 bg-white"
      >
        <div className="relative">
          <table 
            ref={tableRef}
            className="border-collapse table-fixed"
          >
            <TableHeader 
              columns={columns}
              columnWidths={columnWidths}
              selectAll={selectAll}
              onSelectAll={toggleSelectAll}
              onAddColumn={handleAddColumn}
              onResizeStart={handleResizeStart}
              resizingColumn={resizingColumn}
              addColumnButtonRef={addColumnButtonRef}
              onColumnClick={handleColumnClick}
              columnData={columnData}
            />
            <tbody>
              {rows.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  row={row}
                  rowIndex={rowIndex}
                  columnWidths={columnWidths}
                  isSelected={selectedRows[rowIndex]}
                  hoveredIndexCell={hoveredIndexCell}
                  onMouseEnter={setHoveredIndexCell}
                  onMouseLeave={() => setHoveredIndexCell(null)}
                  onRowSelect={toggleRowSelection}
                  onCellChange={handleCellChange}
                  columnData={columnData}
                  files={files}
                  onFileSelect={handleFileSelect}
                  processingCells={processingCells}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Processing status overlay */}
        {isProcessing && (
          <div className="absolute bottom-0 left-0 right-0 bg-blue-50 p-2 border-t border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-sm text-blue-700">
                  Processing {processingStatus.completed} of {processingStatus.total} cells...
                </span>
              </div>
              <div className="flex flex-wrap gap-1 max-w-[60%]">
                {Array.from(processingCells).map(cellKey => {
                  const [rowIndex, colIndex] = cellKey.split('-').map(Number);
                  return (
                    <span key={cellKey} className="text-xs bg-blue-100 text-blue-600 px-1 py-0.5 rounded">
                      Row {rowIndex + 1}, {columns[colIndex]}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="w-full bg-gray-200 h-1 mt-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full transition-all duration-300"
                style={{ 
                  width: `${processingStatus.total > 0 ? (processingStatus.completed / processingStatus.total) * 100 : 0}%`
                }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Edit Column Modal - positioned inside scrollable container */}
        {showEditModal && (
          <EditColumnModal
            show={showEditModal}
            columnIndex={editColumnIndex}
            position={editModalPosition}
            columnTypes={columnTypes}
            selectedColumnType={editColumnType}
            columnName={editColumnName}
            onColumnNameChange={setEditColumnName}
            onColumnTypeSelect={setEditColumnType}
            onCancel={() => setShowEditModal(false)}
            onSave={saveEditedColumn}
            llmPrompt={editColumnLlmPrompt}
            onLlmPromptChange={setEditColumnLlmPrompt}
            isFileColumn={columnData[editColumnIndex]?.isFileInput}
          />
        )}
      </div>

      {/* Add Column Modal for adding new columns */}
      {showAddColumnModal && (
        <AddColumnModal
          show={showAddColumnModal}
          buttonRef={addColumnButtonRef}
          columnTypes={columnTypes}
          selectedColumnType={selectedColumnType}
          newColumnName={newColumnName}
          onColumnNameChange={setNewColumnName}
          onColumnTypeSelect={setSelectedColumnType}
          onCancel={() => setShowAddColumnModal(false)}
          onAdd={addNewColumn}
          llmPrompt={newColumnLlmPrompt}
          onLlmPromptChange={setNewColumnLlmPrompt}
        />
      )}

      {/* Bottom pinned "Add Row" bar */}
      <div 
        className="flex justify-start items-start h-8 w-full bg-white text-sm cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={handleAddRow}>
        <div className="flex justify-center items-center w-8 h-full border border-gray-200">
           <FiPlus size={14} />
        </div>
        <div className="flex justify-start items-center size-full pl-2 border border-gray-200">
          New Row
        </div>
      </div>
    </div>
  );
};

export default Table;
