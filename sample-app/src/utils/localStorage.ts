import type { Todo } from '@/types/todo';

const TODOS_KEY = 'todos';

export const loadTodos = (): Todo[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(TODOS_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    return parsed.map((todo: any) => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
      updatedAt: todo.updatedAt ? new Date(todo.updatedAt) : undefined,
    }));
  } catch (error) {
    console.warn('Failed to load todos from localStorage:', error);
    return [];
  }
};

export const saveTodos = (todos: Todo[]): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
  } catch (error) {
    console.warn('Failed to save todos to localStorage:', error);
  }
};

export const generateId = (): string => {
  return `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};