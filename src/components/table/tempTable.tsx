import React, { useState, useRef, useEffect } from 'react';

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

  // Add a new row. The new row will match the current column count.
  // It also saves the current vertical scroll position before update.
  const handleAddRow = () => {
    if (containerRef.current) {
      scrollTopRef.current = containerRef.current.scrollTop;
    }
    // Create a row with default values.
    const newRow = columns.map((_, colIndex) => `Row${rows.length + 1}-Col${colIndex + 1}`);
    setRows(prevRows => [...prevRows, newRow]);
  };

  // Add a new column to every row. Saves the current horizontal scroll position.
  const handleAddColumn = () => {
    if (containerRef.current) {
      scrollLeftRef.current = containerRef.current.scrollLeft;
    }
    // Update header: append a new column name.
    const newColumnName = `Column ${columns.length + 1}`;
    setColumns(prevColumns => [...prevColumns, newColumnName]);

    // Update every row: append a new cell for the new column.
    setRows(prevRows =>
      prevRows.map((row, rowIndex) => [
        ...row,
        `Row${rowIndex + 1}-Col${columns.length + 1}`,
      ])
    );
  };

  // Styles for the scrollable container.
  const containerStyle: React.CSSProperties = {
    width: '80vw',
    height: '60vh',
    overflow: 'auto',
    border: '1px solid #ccc',
    position: 'relative',
    margin: '20px',
  };

  // Table style: using table-auto behavior and ensuring the table expands naturally.
  const tableStyle: React.CSSProperties = {
    borderCollapse: 'collapse',
    tableLayout: 'auto',
    minWidth: 'min-content', // ensures the table expands with new columns
  };

  // Cell style: fixed minimum width to ensure uniform columns and no wrapping.
  const cellStyle: React.CSSProperties = {
    minWidth: '200px',
    border: '1px solid #ddd',
    padding: '8px',
    whiteSpace: 'nowrap', // prevent text wrapping
  };

  return (
    <div>
      {/* Scrollable container that handles its own scrolling */}
      <div ref={containerRef} style={containerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr style={{
              position: 'sticky',
              top: 0,
              backgroundColor: '#fff',
              zIndex: 1, // ensures header remains above scrolling rows
            }}>
              {/* Render each column header */}
              {columns.map((col, index) => (
                <th key={index} style={cellStyle}>
                  {col}
                </th>
              ))}
              {/* Pinned header cell with the Add Column button */}
              <th
                style={{
                  ...cellStyle,
                  position: 'sticky',
                  right: 0,
                  backgroundColor: '#fff',
                  zIndex: 2,
                }}
              >
                <button onClick={handleAddColumn}>Add Column</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Render table rows */}
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} style={cellStyle}>
                    {cell}
                  </td>
                ))}
                {/* An extra cell to keep alignment with the add column header */}
                <td style={cellStyle}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fixed Add Row button at the bottom center */}
      <button
        onClick={handleAddRow}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        Add Row
      </button>
    </div>
  );
};

export default ScrollableTable;
