import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500">
      <Link href="/knowledge" className="hover:text-gray-700">
        Knowledge
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={item.href}>
          <ChevronRight className="h-4 w-4" />
          <Link
            href={item.href}
            className={`hover:text-gray-700 ${
              index === items.length - 1 ? 'text-gray-900 font-medium' : ''
            }`}
          >
            {item.label}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb; 