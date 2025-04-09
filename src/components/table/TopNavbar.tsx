import React from 'react';

function TopNavBar() {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-200">
      <div className="flex space-x-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Build</button>
        <button className="px-4 py-2 bg-gray-300 rounded">Review</button>
        <button className="px-4 py-2 bg-gray-300 rounded">Automate</button>
      </div>
      <button className="px-4 py-2 bg-green-500 text-white rounded">Export</button>
    </div>
  );
}

export default TopNavBar;