"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { FiPlus } from "react-icons/fi";

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

  // (Optional) If you want resizable columns, track each column’s width:
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
        scrollTopRef.current = null;
      }
      if (scrollLeftRef.current !== null) {
        containerRef.current.scrollLeft = scrollLeftRef.current;
        scrollLeftRef.current = null;
      }
    }
  }, [rows, columns]);

  // Resizing handlers (if you want to support column resizing)
  const handleResizeStart = (e: React.MouseEvent, columnIndex: number) => {
    e.preventDefault();
    setResizingColumn(columnIndex);
    setStartX(e.pageX);
    setStartWidth(columnWidths[columnIndex]);
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

  // Helper: style each regular cell. If using resizable columns, use widths from state.
  const cellStyle = (index: number): React.CSSProperties => ({
    fontSize: '13px',
    minWidth: '200px',
    width: `${columnWidths[index]}px`,
    border: '1px solid #ddd',
    padding: '8px',
    whiteSpace: 'nowrap',
    textAlign: 'left',
    position: 'relative',
  });

  // Resize handle style for header cells.
  const resizeHandleStyle: React.CSSProperties = {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '5px',
    cursor: 'col-resize',
    backgroundColor: resizingColumn !== null ? '#0066ff' : 'transparent',
  };

  // The pinned (or "Add Column") header cell. Its style does not force the table’s width.
  const pinnedCellStyle: React.CSSProperties = {
    ...cellStyle(0), // use same height and padding as other cells
    // instead of using cellStyle with an invalid index, we set a fixed width for the pinned cell
    width: '50px',
    minWidth: '50px',
    right: 0,
    backgroundColor: '#fff',
    zIndex: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  };

  // Handlers for adding rows and columns.
  const handleAddRow = () => {
    if (containerRef.current) {
      scrollTopRef.current = containerRef.current.scrollTop;
    }
    // Create a new row with empty cells.
    const newRow = columns.map(() => '');
    setRows((prev) => [...prev, newRow]);
  };

  const handleAddColumn = () => {
    if (containerRef.current) {
      scrollLeftRef.current = containerRef.current.scrollLeft;
    }
    const newColumnName = `Column ${columns.length + 1}`;
    setColumns((prev) => [...prev, newColumnName]);
    // When adding a column, also add a default width for it.
    setColumnWidths((prev) => [...prev, 200]);
    setRows((prevRows) => prevRows.map((row) => [...row, '']));
  };

  // Styles for the scrollable container.
  const containerStyle: React.CSSProperties = {
    width: '100%', // Now fills the parent's width exactly
    height: '85%',
    overflow: 'auto',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
  };

  // Table style:
  // We let the table expand naturally by using table-layout: auto and a min-width of min-content.
  const tableStyle: React.CSSProperties = {
    borderCollapse: 'collapse',
    tableLayout: 'auto',
    minWidth: 'min-content',
  };

  return (
    <div className="size-full bg-gray-100">
      {/* Page header */}
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
          <thead>
            <tr style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
              {columns.map((col, index) => (
                <th key={index} style={cellStyle(index)}>
                  {col}
                  <div
                    style={resizeHandleStyle}
                    onMouseDown={(e) => handleResizeStart(e, index)}
                  />
                </th>
              ))}
              {/* Pinned header cell for "Add Column" */}
              <th style={pinnedCellStyle}>
                <button onClick={handleAddColumn}>
                  <FiPlus size={20} />
                </button>
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
                      onChange={(e) =>
                        setRows((prevRows) => {
                          const newRows = [...prevRows];
                          newRows[rowIndex][cellIndex] = e.target.value;
                          return newRows;
                        })
                      }
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                      }}
                    />
                  </td>
                ))}
                {/* Extra cell for alignment with the pinned header cell.
                    Use a fixed style rather than cellStyle with an invalid index. */}
                {/* <td style={pinnedCellStyle}></td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fixed Add Row button */}
     {/* Bottom pinned bar (like the image) */}
      <div 
        className="flex justify-start items-start h-10 w-full bg-white text-sm cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={handleAddRow}>
        <div className="flex justify-center items-center w-10 h-full border border-gray-200">
           <FiPlus size={15} />
        </div>
        <div className="flex justify-start items-center size-full pl-2 border border-gray-200">
          New Row
        </div>
      </div>
    </div>
  );
};

export default ScrollableTable;
