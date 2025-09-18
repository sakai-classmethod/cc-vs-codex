"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
};

const STORAGE_KEY = "sample-app.tasks";

function createTask(title: string): Task {
  const fallbackId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return {
    id:
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : fallbackId,
    title,
    completed: false,
    createdAt: Date.now(),
  };
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY);
      if (!storedValue) {
        return;
      }

      const parsed: unknown = JSON.parse(storedValue);
      if (!Array.isArray(parsed)) {
        return;
      }

      const sanitized = parsed
        .filter((item): item is Task => {
          if (!item || typeof item !== "object") {
            return false;
          }

          const candidate = item as Partial<Task>;
          return (
            typeof candidate.id === "string" &&
            typeof candidate.title === "string" &&
            typeof candidate.completed === "boolean"
          );
        })
        .map((item) => ({
          ...item,
          createdAt:
            typeof item.createdAt === "number" ? item.createdAt : Date.now(),
        }));

      if (sanitized.length > 0) {
        sanitized.sort((a, b) => b.createdAt - a.createdAt);
        setTasks(sanitized);
      }
    } catch (error) {
      console.warn("Failed to read tasks from localStorage", error);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.warn("Failed to persist tasks to localStorage", error);
    }
  }, [tasks, hasHydrated]);

  const remainingCount = useMemo(
    () => tasks.filter((task) => !task.completed).length,
    [tasks],
  );
  const completedCount = tasks.length - remainingCount;
  const hasTasks = tasks.length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) {
      return;
    }

    setTasks((current) => [createTask(trimmed), ...current]);
    setInputValue("");
  };

  const handleToggle = (id: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const handleDelete = (id: string) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  return (
    <div className="min-h-dvh bg-slate-100 py-14 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 sm:px-8">
        <header className="flex flex-col gap-2 text-center sm:text-left">
          <span className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Stay organized
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Personal Task Board
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Add tasks, mark them complete, and keep track of what is next.
          </p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg backdrop-blur sm:p-8 dark:border-slate-800 dark:bg-slate-900/80">
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={handleSubmit}
          >
            <label className="sr-only" htmlFor="task-input">
              Task title
            </label>
            <input
              id="task-input"
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base shadow-inner shadow-slate-200 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-slate-700 dark:bg-slate-900"
              placeholder="Add a new task"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              autoComplete="off"
              disabled={!hasHydrated}
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={!hasHydrated || inputValue.trim().length === 0}
            >
              Add Task
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-1 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>
              {remainingCount} task{remainingCount === 1 ? "" : "s"} left ·{" "}
              {completedCount} completed
            </span>
            {hasTasks && (
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Saved automatically to this browser
              </span>
            )}
          </div>

          {hasTasks ? (
            <ul className="mt-6 space-y-3">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm transition hover:border-sky-200 hover:bg-white dark:border-slate-700 dark:bg-slate-900"
                >
                  <input
                    aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
                    checked={task.completed}
                    className="size-5 rounded-full border-2 border-slate-300 text-sky-500 accent-sky-500 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-slate-600"
                    onChange={() => handleToggle(task.id)}
                    type="checkbox"
                  />
                  <div className="flex-1 overflow-hidden">
                    <p
                      className={`text-sm font-medium transition ${task.completed ? "text-slate-400 line-through" : "text-slate-900 dark:text-slate-100"}`}
                    >
                      {task.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      Added {new Date(task.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(task.id)}
                    className="rounded-xl border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 transition hover:border-rose-200 hover:text-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 dark:border-slate-700 dark:text-slate-400"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-400">
              <p>No tasks yet. Add something you need to get done.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
