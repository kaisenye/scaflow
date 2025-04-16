import React from 'react';
import Link from 'next/link';
import { Folder, Table, Plus, Calendar, Columns, FileText } from 'lucide-react';

interface TableItem {
  id: string;
  name: string;
  type: 'table';
  path: string;
  size: number;
  updatedAt: string;
  description?: string;
  columns?: number;
  files?: number;
}

interface Project {
  id: string;
  name: string;
  tables: TableItem[];
  updatedAt: string;
  totalSize: number;
}

interface TableExplorerProps {
  projects: Project[];
  currentProjectId?: string;
}

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });
};

const TableExplorer: React.FC<TableExplorerProps> = ({ projects, currentProjectId }) => {
  return (
    <div className="w-full">
      {!currentProjectId ? (
        // Projects view
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-0.5">
                  <h3 className="font-medium text-sm">{project.name}</h3>
                  <p className="flex flex-row text-xs text-gray-500">Updated {formatDate(project.updatedAt)}</p>
                </div>
                <div className="flex flex-row items-center gap-2 text-xs text-gray-500">
                  <Folder className="h-3 w-3 text-gray-500" />
                  <p>{project.tables.length} tables ({formatFileSize(project.totalSize)})</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        // Tables view within a project
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects
            .find((p) => p.id === currentProjectId)
            ?.tables.map((table) => (
              <Link
                key={table.id}
                href={`/projects/${currentProjectId}/${table.id}`}
                className="flex flex-col p-4 bg-white border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center mb-8">
                  <Table className="h-4 w-4 text-gray-500 mr-2" />
                  <h3 className="font-medium text-sm">{table.name}</h3>
                </div>
                
                {table.description && (
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{table.description}</p>
                )}
                
                <div className="">
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{formatDate(table.updatedAt)}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Columns className="h-3 w-3 mr-1" />
                      <span>{table.columns || 0} columns</span>
                    </div>
                    
                    <div className="flex items-center">
                      <FileText className="h-3 w-3 mr-1" />
                      <span>{table.files || 0} files</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default TableExplorer; 