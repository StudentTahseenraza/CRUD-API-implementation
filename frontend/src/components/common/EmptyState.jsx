import React from 'react';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

const EmptyState = ({
  icon: Icon = ClipboardDocumentIcon,
  title = 'No data found',
  description = 'Get started by creating a new item.',
  action,
}) => {
  return (
    <div className="text-center py-12">
      <Icon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;