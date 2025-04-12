import React from 'react';
import { FiCheck } from "react-icons/fi";

interface CheckboxProps {
  checked: boolean;
  onClick: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onClick }) => {
  return (
    <div 
      className={`size-4 border rounded flex items-center justify-center cursor-pointer ${checked ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}
      onClick={onClick}
    >
      {checked && <FiCheck size={14} className="text-white" />}
    </div>
  );
};

export default Checkbox; 