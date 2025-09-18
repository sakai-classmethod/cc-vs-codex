"use client";

import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Todo } from "../types/todo";

export default function TodoApp() {
  const [todos, setTodos] = useLocalStorage<Todo[]>("todos", []);
  const [inputValue, setInputValue] = useState("");

  const addTodo = () => {
    if (inputValue.trim() === "") return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputValue,
      completed: false,
      createdAt: new Date(),
    };

    setTodos([...todos, newTodo]);
    setInputValue("");
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">
        TODOアプリ
      </h1>

      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="新しいタスクを入力..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={addTodo}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            追加
          </button>
        </div>
      </div>

      {totalCount > 0 && (
        <div className="mb-4 text-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            完了: {completedCount} / {totalCount}
          </span>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        {todos.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            タスクがありません。新しいタスクを追加してください。
          </p>
        ) : (
          todos.map(todo => (
            <div
              key={todo.id}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span
                className={`flex-1 ${
                  todo.completed
                    ? "line-through text-gray-500 dark:text-gray-400"
                    : "text-gray-800 dark:text-white"
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                削除
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}