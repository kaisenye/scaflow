'use client';

import React from 'react';
import Table from '@/components/table/MainTable';

interface PageProps {
  params: Promise<{
    projectId: string;
    tableId: string;
  }>;
}

const TablePage = ({ params }: PageProps) => {
  const resolvedParams = React.use(params);
  const { projectId, tableId } = resolvedParams;

  return <Table />;
};

export default TablePage; 