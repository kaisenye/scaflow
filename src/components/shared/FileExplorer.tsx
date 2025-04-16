import React from 'react';
import Link from 'next/link';
import { Folder, File, Plus } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file';
  path: string;
  size: number;
  updatedAt: string;
}

interface Collection {
  id: string;
  name: string;
  files: FileItem[];
  updatedAt: string;
  totalSize: number;
}

interface FileExplorerProps {
  collections: Collection[];
  currentCollectionId?: string;
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

const FileExplorer: React.FC<FileExplorerProps> = ({ collections, currentCollectionId }) => {
  return (
    <div className="w-full">
      {!currentCollectionId ? (
        // Collections view
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/knowledge/${collection.id}`}
              className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-0.5">
                  <h3 className="font-medium text-sm">{collection.name}</h3>
                  <p className="flex flex-row text-xs text-gray-500">Updated {formatDate(collection.updatedAt)}</p>
                </div>
                <div className="flex flex-row items-center gap-2 text-xs text-gray-500">
                  <Folder className="h-3 w-3 text-gray-500" />
                  <p>{collection.files.length} files ({formatFileSize(collection.totalSize)})</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        // Files view within a collection
        <div className="space-y-2">
          {collections
            .find((c) => c.id === currentCollectionId)
            ?.files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <File className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-sm">{file.name}</span>
                </div>
                <div className="text-xs text-gray-500">
                  <span>{formatFileSize(file.size)} • {formatDate(file.updatedAt)}</span>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default FileExplorer; 