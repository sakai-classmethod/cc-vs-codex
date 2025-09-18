'use client';

import { useMemo } from 'react';
import { useTodoReducer } from '@/hooks/useTodoReducer';
import { TodoForm } from './TodoForm';
import { TodoFilters } from './TodoFilters';
import { TodoList } from './TodoList';
import type { FilterType } from '@/types/todo';

export const TodoApp = () => {
  const { state, dispatch } = useTodoReducer();

  const filteredTodos = useMemo(() => {
    switch (state.filter) {
      case 'active':
        return state.todos.filter(todo => !todo.completed);
      case 'completed':
        return state.todos.filter(todo => todo.completed);
      default:
        return state.todos;
    }
  }, [state.todos, state.filter]);

  const todoCount = useMemo(() => {
    const total = state.todos.length;
    const completed = state.todos.filter(todo => todo.completed).length;
    const active = total - completed;
    return { total, active, completed };
  }, [state.todos]);

  const handleAddTodo = (text: string) => {
    dispatch({ type: 'ADD_TODO', text });
  };

  const handleToggleTodo = (id: string) => {
    dispatch({ type: 'TOGGLE_TODO', id });
  };

  const handleDeleteTodo = (id: string) => {
    dispatch({ type: 'DELETE_TODO', id });
  };

  const handleFilterChange = (filter: FilterType) => {
    dispatch({ type: 'SET_FILTER', filter });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Todo App
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Keep track of your tasks and stay organized
        </p>
      </div>

      <TodoForm onAdd={handleAddTodo} />

      {state.todos.length > 0 && (
        <TodoFilters
          activeFilter={state.filter}
          onFilterChange={handleFilterChange}
          todoCount={todoCount}
        />
      )}

      <TodoList
        todos={filteredTodos}
        onToggle={handleToggleTodo}
        onDelete={handleDeleteTodo}
      />
    </div>
  );
};