'use client';

import React from 'react';
import Table from '@/components/table/MainTable';
import Breadcrumb from '@/components/shared/Breadcrumb';

// Mock data for projects (same as in the main page)
const mockProjects = [
  {
    id: '1',
    name: 'Customer Analytics',
    tables: [
      { 
        id: '1', 
        name: 'customer_data', 
        type: 'table' as const, 
        path: '/customer_data', 
        size: 1024, 
        updatedAt: '2024-04-15T10:30:00Z',
        description: 'Customer demographic and contact information',
        columns: 12,
        files: 3
      },
      { 
        id: '2', 
        name: 'purchase_history', 
        type: 'table' as const, 
        path: '/purchase_history', 
        size: 2048, 
        updatedAt: '2024-04-16T14:45:00Z',
        description: 'Historical purchase data and transaction records',
        columns: 8,
        files: 5
      },
    ],
    updatedAt: '2024-04-16T14:45:00Z',
    totalSize: 3072,
  },
  {
    id: '2',
    name: 'Inventory Management',
    tables: [
      { 
        id: '3', 
        name: 'products', 
        type: 'table' as const, 
        path: '/products', 
        size: 4096, 
        updatedAt: '2024-04-17T09:15:00Z',
        description: 'Product catalog with specifications and pricing',
        columns: 15,
        files: 2
      },
      { 
        id: '4', 
        name: 'stock_levels', 
        type: 'table' as const, 
        path: '/stock_levels', 
        size: 1536, 
        updatedAt: '2024-04-18T16:20:00Z',
        description: 'Current inventory levels and stock alerts',
        columns: 6,
        files: 1
      },
    ],
    updatedAt: '2024-04-18T16:20:00Z',
    totalSize: 5632,
  },
  {
    id: '3',
    name: 'Sales Dashboard',
    tables: [
      { 
        id: '5', 
        name: 'sales_data', 
        type: 'table' as const, 
        path: '/sales_data', 
        size: 512, 
        updatedAt: '2024-04-19T11:30:00Z',
        description: 'Daily sales transactions and revenue data',
        columns: 10,
        files: 4
      },
      { 
        id: '6', 
        name: 'revenue_metrics', 
        type: 'table' as const, 
        path: '/revenue_metrics', 
        size: 768, 
        updatedAt: '2024-04-20T13:45:00Z',
        description: 'Aggregated revenue metrics and KPIs',
        columns: 7,
        files: 2
      },
    ],
    updatedAt: '2024-04-20T13:45:00Z',
    totalSize: 1280,
  },
];

interface PageProps {
  params: Promise<{
    projectId: string;
    tableId: string;
  }>;
}

const TablePage = ({ params }: PageProps) => {
  const resolvedParams = React.use(params);
  const { projectId, tableId } = resolvedParams;

  const project = mockProjects.find((p) => p.id === projectId);
  const table = project?.tables.find((t) => t.id === tableId);

  if (!project || !table) {
    return <div>Table not found</div>;
  }

  const breadcrumbItems = [
    {
      label: project.name,
      href: `/projects/${projectId}`,
    },
    {
      label: table.name,
      href: `/projects/${projectId}/${tableId}`,
    },
  ];

  return (
    <div className="size-full py-4">
      <div className="mb-4 ml-4">
        <Breadcrumb items={breadcrumbItems} context="projects" />
      </div>
      <Table />
    </div>
  );
};

export default TablePage; 