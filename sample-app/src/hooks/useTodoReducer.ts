import { useReducer, useEffect } from 'react';
import type { Todo, TodoState, TodoAction, FilterType } from '@/types/todo';
import { loadTodos, saveTodos, generateId } from '@/utils/localStorage';

const initialState: TodoState = {
  todos: [],
  filter: 'all',
};

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'LOAD_TODOS':
      return {
        ...state,
        todos: action.todos,
      };

    case 'ADD_TODO': {
      if (!action.text.trim()) {
        return state;
      }

      const newTodo: Todo = {
        id: generateId(),
        text: action.text.trim().slice(0, 500), // Length limit
        completed: false,
        createdAt: new Date(),
      };

      return {
        ...state,
        todos: [...state.todos, newTodo],
      };
    }

    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.id
            ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
            : todo
        ),
      };

    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.id),
      };

    case 'SET_FILTER':
      return {
        ...state,
        filter: action.filter,
      };

    default:
      return state;
  }
};

export const useTodoReducer = () => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Load todos from localStorage on mount
  useEffect(() => {
    const todos = loadTodos();
    dispatch({ type: 'LOAD_TODOS', todos });
  }, []);

  // Save todos to localStorage when todos change
  useEffect(() => {
    if (state.todos.length > 0 || loadTodos().length > 0) {
      saveTodos(state.todos);
    }
  }, [state.todos]);

  return { state, dispatch };
};