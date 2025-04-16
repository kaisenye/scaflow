import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  actions?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }[];
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, actions = [] }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-base font-semibold">{title}</h1>
      <div className="flex gap-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            size="default"
            onClick={action.onClick}
            className="flex items-center gap-2 shadow-none rounded-sm"
          >
            {action.icon || <Plus className="h-4 w-4" />}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PageHeader; 