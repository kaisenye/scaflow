import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  context?: 'knowledge' | 'projects' | 'default';
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, context = 'default' }) => {
  // Define the root link based on context
  const getRootLink = () => {
    switch (context) {
      case 'knowledge':
        return {
          label: 'Knowledge',
          href: '/knowledge'
        };
      case 'projects':
        return {
          label: 'Projects',
          href: '/projects'
        };
      default:
        return {
          label: 'Home',
          href: '/'
        };
    }
  };

  const rootLink = getRootLink();

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500">
      <Link href={rootLink.href} className="hover:text-gray-700 flex items-center">
        {rootLink.label}
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