import React from 'react';

const TaskFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="input-field"
        />
      </div>
      
      <select
        value={filters.status || ''}
        onChange={(e) => onFilterChange({ status: e.target.value })}
        className="input-field sm:w-40"
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      
      <select
        value={filters.priority || ''}
        onChange={(e) => onFilterChange({ priority: e.target.value })}
        className="input-field sm:w-40"
      >
        <option value="">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  );
};

export default TaskFilters;