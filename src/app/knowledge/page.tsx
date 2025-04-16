'use client';

import React from 'react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import FileExplorer from '@/components/shared/FileExplorer';
import PageHeader from '@/components/shared/PageHeader';

// Mock data for collections
const mockCollections = [
  {
    id: '1',
    name: 'Project Documents',
    files: [
      { id: '1', name: 'Project Plan.pdf', type: 'file' as const, path: '/project-plan.pdf', size: 1024, updatedAt: '2023-05-15T10:30:00Z' },
      { id: '2', name: 'Requirements.docx', type: 'file' as const, path: '/requirements.docx', size: 2048, updatedAt: '2023-05-20T14:45:00Z' },
    ],
    updatedAt: '2023-05-20T14:45:00Z',
    totalSize: 3072,
  },
  {
    id: '2',
    name: 'Research Papers',
    files: [
      { id: '3', name: 'AI Research.pdf', type: 'file' as const, path: '/ai-research.pdf', size: 4096, updatedAt: '2023-06-01T09:15:00Z' },
      { id: '4', name: 'Machine Learning.docx', type: 'file' as const, path: '/ml.docx', size: 1536, updatedAt: '2023-06-05T16:20:00Z' },
    ],
    updatedAt: '2023-06-05T16:20:00Z',
    totalSize: 5632,
  },
  {
    id: '3',
    name: 'Notes',
    files: [
      { id: '5', name: 'Meeting Notes.txt', type: 'file' as const, path: '/meeting-notes.txt', size: 512, updatedAt: '2023-06-10T11:30:00Z' },
      { id: '6', name: 'Ideas.md', type: 'file' as const, path: '/ideas.md', size: 768, updatedAt: '2023-06-12T13:45:00Z' },
    ],
    updatedAt: '2023-06-12T13:45:00Z',
    totalSize: 1280,
  },
];

const KnowledgePage = () => {
  const handleAddCollection = () => {
    // TODO: Implement add collection functionality
    console.log('Add collection clicked');
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 ml-6">
          <Breadcrumb items={[]} context="knowledge" />
        </div>
        
        <div className="bg-white border border-gray-200 rounded-md p-6">
          <PageHeader
            title="Knowledge"
            actions={[
              {
                label: 'Add Collection',
                onClick: handleAddCollection,
              },
            ]}
          />
          <FileExplorer collections={mockCollections} />
        </div>
      </div>
    </div>
  );
};

export default KnowledgePage;