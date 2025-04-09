"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { FiPlus } from "react-icons/fi";

// A functional component for a scrollable table with dynamic rows and columns.
const ScrollableTable: React.FC = () => {
  // Initial table layout: two columns and two rows.
  const initialColumns = ['Column 1', 'Column 2'];
  const initialRows = [
    ['Row1-Col1', 'Row1-Col2'],
    ['Row2-Col1', 'Row2-Col2'],
  ];

  // State for header (columns) and body (rows).
  const [columns, setColumns] = useState<string[]>(initialColumns);
  const [rows, setRows] = useState<string[][]>(initialRows);
  const [columnWidths, setColumnWidths] = useState<number[]>(initialColumns.map(() => 200));
  const [resizingColumn, setResizingColumn] = useState<number | null>(null);
  const [startX, setStartX] = useState<number>(0);
  const [startWidth, setStartWidth] = useState<number>(0);

  // Ref to the scrollable container.
  const containerRef = useRef<HTMLDivElement>(null);

  // Refs to hold scroll positions for restoration.
  const scrollTopRef = useRef<number | null>(null);
  const scrollLeftRef = useRef<number | null>(null);

  // After each update to rows or columns, restore scroll positions.
  useEffect(() => {
    if (containerRef.current) {
      if (scrollTopRef.current !== null) {
        containerRef.current.scrollTop = scrollTopRef.current;
        scrollTopRef.current = null; // reset after restoration
      }
      if (scrollLeftRef.current !== null) {
        containerRef.current.scrollLeft = scrollLeftRef.current;
        scrollLeftRef.current = null;
      }
    }
  }, [rows, columns]);

  // Handle mouse down on resize handle
  const handleResizeStart = (e: React.MouseEvent, columnIndex: number) => {
    e.preventDefault();
    setResizingColumn(columnIndex);
    setStartX(e.pageX);
    setStartWidth(columnWidths[columnIndex]);
  };

  // Handle mouse move during resize
  const handleResizeMove = (e: MouseEvent) => {
    if (resizingColumn === null) return;
    
    const diff = e.pageX - startX;
    const newWidth = Math.max(50, startWidth + diff); // Minimum width of 50px
    
    setColumnWidths(prev => {
      const newWidths = [...prev];
      newWidths[resizingColumn] = newWidth;
      return newWidths;
    });
  };

  // Handle mouse up to end resize
  const handleResizeEnd = () => {
    setResizingColumn(null);
  };

  // Add and remove event listeners for resize
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

  // Cell style: fixed width based on state; used for regular cells.
  const cellStyle = (index: number): React.CSSProperties => ({
    minWidth: '50px',
    width: `${columnWidths[index]}px`,
    border: '1px solid #ddd',
    padding: '4px',
    whiteSpace: 'nowrap',
    textAlign: 'left',
    position: 'relative',
  });

  // Style for the resize handle in header cells.
  const resizeHandleStyle: React.CSSProperties = {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '5px',
    cursor: 'col-resize',
    backgroundColor: resizingColumn !== null ? '#0066ff' : 'transparent',
  };

  // Pinned header cell style for the "Add Column" button.
  const pinnedCellStyle: React.CSSProperties = {
    width: '35px',
    aspectRatio: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'sticky',
    right: 0,
    zIndex: 2,
    cursor: 'pointer',
  };

  // Add a new row. The new row will match the current column count.
  // It also saves the current vertical scroll position before update.
  const handleAddRow = () => {
    if (containerRef.current) {
      scrollTopRef.current = containerRef.current.scrollTop;
    }
    // Create a row with empty values.
    const newRow = columns.map(() => '');
    setRows(prevRows => [...prevRows, newRow]);
  };

  // Handle cell content change.
  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    setRows(prevRows => {
      const newRows = [...prevRows];
      newRows[rowIndex][colIndex] = value;
      return newRows;
    });
  };

  // Add a new column to every row. Saves the current horizontal scroll position.
  const handleAddColumn = () => {
    if (containerRef.current) {
      scrollLeftRef.current = containerRef.current.scrollLeft;
    }
    // Update header: append a new column name.
    const newColumnName = `Column ${columns.length + 1}`;
    setColumns(prevColumns => [...prevColumns, newColumnName]);
    setColumnWidths(prevWidths => [...prevWidths, 200]); // Add default width for new column

    // Update every row: append a blank cell for the new column.
    setRows(prevRows =>
      prevRows.map(row => [...row, ''])
    );
  };

  // Styles for the scrollable container.
  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '88%',
    backgroundColor: 'white',
    overflow: 'auto',
    position: 'relative',
  };

  // Table style: using table-auto and allowing natural expansion.
  const tableStyle: React.CSSProperties = {
    borderCollapse: 'collapse',
    tableLayout: 'auto',
    minWidth: 'min-content',
  };

  return (
    <div className="w-full h-full bg-gray-100">
      {/* header */}
      <div className="flex justify-between items-center py-2 px-4">
        <div className="text-base font-bold">Main Table</div>
        <div className="flex items-center gap-2 text-sm">
          <button className="bg-gray-100 px-2 py-1 rounded-sm">Share</button>
          <button className="bg-gray-100 px-2 py-1 rounded-sm">Download</button>
        </div>
      </div>

      {/* Scrollable container */}
      <div ref={containerRef} style={containerStyle}>
        <table style={tableStyle}>
          <thead className="text-sm">
            <tr style={{
              position: 'sticky',
              top: 0,
              backgroundColor: '#fff',
              zIndex: 1,
            }}>
              {columns.map((col, index) => (
                <th key={index} style={cellStyle(index)}>
                  {col}
                  <div
                    style={resizeHandleStyle}
                    onMouseDown={(e) => handleResizeStart(e, index)}
                  />
                </th>
              ))}
              {/* Pinned header cell for Add Column */}
              <th
                style={pinnedCellStyle}
                className="hover:bg-gray-100 bg-white transition-all duration-200"
                onClick={handleAddColumn}
              >
                <FiPlus size={20} />
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} style={cellStyle(cellIndex)}>
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                      }}
                    />
                  </td>
                ))}
                {/* Extra cell for alignment with pinned header cell */}
                <td style={cellStyle(columns.length)}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fixed Add Row button */}
      <div className="flex justify-start items-start py-2 px-4">
        <Button
          onClick={handleAddRow}
        >
          Add Row
        </Button>
      </div>
    </div>
  );
};

export default ScrollableTable;
