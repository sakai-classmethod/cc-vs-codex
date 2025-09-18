import type { FilterType } from '@/types/todo';

interface TodoFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  todoCount: { total: number; active: number; completed: number };
}

export const TodoFilters = ({ activeFilter, onFilterChange, todoCount }: TodoFiltersProps) => {
  const filters: Array<{ key: FilterType; label: string; count: number }> = [
    { key: 'all', label: 'All', count: todoCount.total },
    { key: 'active', label: 'Active', count: todoCount.active },
    { key: 'completed', label: 'Completed', count: todoCount.completed },
  ];

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {filters.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeFilter === key
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
            aria-pressed={activeFilter === key}
          >
            {label}
            <span className="ml-1 text-xs opacity-60">({count})</span>
          </button>
        ))}
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        {todoCount.active} active, {todoCount.completed} completed
      </div>
    </div>
  );
};