import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ErrorDisplay = ({ error, onRetry }) => {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error occurred</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error.message || 'Something went wrong'}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                onClick={onRetry}
                className="text-sm font-medium text-red-800 hover:text-red-700"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;