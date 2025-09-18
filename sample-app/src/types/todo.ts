export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface TodoState {
  todos: Todo[];
  filter: FilterType;
}

export type TodoAction =
  | { type: 'ADD_TODO'; text: string }
  | { type: 'TOGGLE_TODO'; id: string }
  | { type: 'DELETE_TODO'; id: string }
  | { type: 'SET_FILTER'; filter: FilterType }
  | { type: 'LOAD_TODOS'; todos: Todo[] };