import React from 'react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import FileExplorer from '@/components/shared/FileExplorer';

// Mock data for collections
const mockCollections = [
  {
    id: '1',
    name: 'Project Documents',
    files: [
      { id: '1', name: 'Project Plan.pdf', type: 'file' as const, path: '/project-plan.pdf' },
      { id: '2', name: 'Requirements.docx', type: 'file' as const, path: '/requirements.docx' },
    ],
  },
  {
    id: '2',
    name: 'Research Papers',
    files: [
      { id: '3', name: 'AI Research.pdf', type: 'file' as const, path: '/ai-research.pdf' },
      { id: '4', name: 'Machine Learning.docx', type: 'file' as const, path: '/ml.docx' },
    ],
  },
  {
    id: '3',
    name: 'Notes',
    files: [
      { id: '5', name: 'Meeting Notes.txt', type: 'file' as const, path: '/meeting-notes.txt' },
      { id: '6', name: 'Ideas.md', type: 'file' as const, path: '/ideas.md' },
    ],
  },
];

const KnowledgePage = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 ml-6">
          <Breadcrumb items={[]} />
        </div>
        
        <div className="bg-white border border-gray-200 rounded-md p-6">
          <h1 className="text-base font-semibold mb-6">
            Knowledge
          </h1>
          <FileExplorer collections={mockCollections} />
        </div>
      </div>
    </div>
  );
};

export default KnowledgePage;