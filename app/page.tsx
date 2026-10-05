"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3010";

type Todo = {
  id: number;
  title: string;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadTodos = useCallback(async () => {
    const response = await fetch(`${API}/api/todos?limit=100&sort=-createdAt`);
    if (!response.ok) {
      throw new Error("No se pudieron cargar las tareas");
    }
    const data = (await response.json()) as { docs: Todo[] };
    setTodos(data.docs);
  }, []);

  useEffect(() => {
    loadTodos()
      .catch((loadError: Error) => setError(loadError.message))
      .finally(() => setLoading(false));
  }, [loadTodos]);

  async function createTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle) return;

    setSaving(true);
    setError("");
    try {
      const response = await fetch(`${API}/api/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: nextTitle }),
      });
      if (!response.ok) {
        throw new Error("No se pudo crear la tarea");
      }
      setTitle("");
      await loadTodos();
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "No se pudo crear la tarea",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteTodo(id: number) {
    setError("");
    const response = await fetch(`${API}/api/todos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      setError("No se pudo eliminar la tarea");
      return;
    }
    setTodos((current) => current.filter((todo) => todo.id !== id));
  }

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <main className="w-full max-w-xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Tareas
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Se guardan en Payload y se listan desde esta página.
        </p>

        <form onSubmit={createTodo} className="mt-8 flex gap-3">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Nueva tarea"
            aria-label="Nueva tarea"
            className="h-12 min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white px-4 text-zinc-950 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
          />
          <button
            type="submit"
            disabled={saving || title.trim().length === 0}
            className="h-12 rounded-xl bg-zinc-950 px-5 font-medium text-white disabled:opacity-40 dark:bg-zinc-50 dark:text-zinc-950"
          >
            Crear
          </button>
        </form>

        {error ? (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <ul className="mt-6 flex flex-col gap-2">
          {loading ? (
            <li className="text-zinc-500">Cargando tareas...</li>
          ) : todos.length === 0 ? (
            <li className="text-zinc-500">No hay tareas.</li>
          ) : (
            todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3 dark:bg-zinc-950"
              >
                <span className="text-zinc-950 dark:text-zinc-50">
                  {todo.title}
                </span>
                <button
                  type="button"
                  onClick={() => deleteTodo(todo.id)}
                  className="text-sm font-medium text-zinc-500 hover:text-red-600"
                >
                  Eliminar
                </button>
              </li>
            ))
          )}
        </ul>
      </main>
    </div>
  );
}
