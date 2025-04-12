import React from 'react';
import Link from 'next/link';
import { Folder, File, Plus } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file';
  path: string;
}

interface Collection {
  id: string;
  name: string;
  files: FileItem[];
}

interface FileExplorerProps {
  collections: Collection[];
  currentCollectionId?: string;
}

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
              <Folder className="h-5 w-5 text-blue-500 mt-1" />
              <div>
                <h3 className="font-medium text-sm">{collection.name}</h3>
                <p className="text-xs text-gray-500">{collection.files.length} files</p>
              </div>
            </Link>
          ))}
          <button className="flex items-center p-4 bg-gray-50 border border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
            <Plus className="h-5 w-5 text-gray-400 mr-3" />
            <span className="text-gray-600 text-sm">New Collection</span>
          </button>
        </div>
      ) : (
        // Files view within a collection
        <div className="space-y-2">
          {collections
            .find((c) => c.id === currentCollectionId)
            ?.files.map((file) => (
              <div
                key={file.id}
                className="flex items-center p-3 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <File className="h-5 w-5 text-gray-500 mr-3" />
                <span className="text-sm">{file.name}</span>
              </div>
            ))}
          <button className="flex items-center p-3 bg-gray-50 border border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-colors w-full">
            <Plus className="h-5 w-5 text-gray-400 mr-3" />
            <span className="text-gray-600 text-sm">Upload File</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default FileExplorer; 