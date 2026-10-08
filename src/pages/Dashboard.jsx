import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";

const FILTERS = ["all", "pending", "completed"];
const input =
  "w-full border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none";

export default function Dashboard() {
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      const res = await api.list(filter, page);
      if (res.data.length === 0 && page > 1) return setPage(page - 1); // page emptied -> go back
      setTasks(res.data);
      setMeta(res.meta);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filter, page]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Title is required");
    setError("");
    try {
      await api.create({
        title: form.title.trim(),
        description: form.description.trim(),
      });
      setForm({ title: "", description: "" });
      if (page !== 1) setPage(1);
      else await loadTasks();
    } catch (e) {
      setError(e.message);
    }
  };

  const updateTask = async (action, id) => {
    setError("");
    try {
      await action(id);
      await loadTasks();
    } catch (e) {
      setError(e.message);
    }
  };

  const changeFilter = (f) => {
    setFilter(f);
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-gray-100 text-gray-800">
      <div className="mx-auto max-w-2xl px-4 py-10">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Task Manager</h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-600">Hi, {user.name}</span>
            <button
              onClick={logout}
              className="bg-gray-800 px-3 py-1.5 text-white hover:bg-gray-900"
            >
              Logout
            </button>
          </div>
        </header>

        {error && (
          <div role="alert" className="mb-4 bg-red-100 px-4 py-2 text-red-800">
            {error}
          </div>
        )}

        {/* Add task */}
        <form
          onSubmit={addTask}
          className="mb-6 space-y-3 rounded-xl bg-white p-4 shadow-sm"
        >
          <input
            className={input}
            placeholder="Task title *"
            value={form.title}
            maxLength={120}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className={input}
            rows={3}
            placeholder="Description (optional)"
            value={form.description}
            maxLength={1000}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button className="bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
            Add Task
          </button>
        </form>

        {/* Filter */}
        <div className="mb-4 flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => changeFilter(f)}
              className={`px-3 py-1.5 text-sm font-medium capitalize ${
                f === filter
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <p className="text-center text-gray-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks found.</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => {
              const done = task.status === "completed";
              return (
                <li
                  key={task.id}
                  className="flex items-start justify-between gap-4 rounded-xl bg-white p-4 shadow-sm"
                >
                  <div className="min-w-0">
                    <h3
                      className={`font-semibold ${done ? "text-gray-400 line-through" : ""}`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="mt-1 break-words text-gray-600">
                        {task.description}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      <span
                        className={`mr-2 rounded-full px-2 py-0.5 ${
                          done
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {done ? "Completed" : "Pending"}
                      </span>
                      {new Date(task.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2">
                    {!done && (
                      <button
                        onClick={() => updateTask(api.complete, task.id)}
                        className="bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => updateTask(api.remove, task.id)}
                      className="bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="mt-5 flex items-center justify-center gap-4 text-sm">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="bg-gray-200 px-3 py-1.5 hover:bg-gray-300 disabled:opacity-40"
            >
              Prev
            </button>
            <span className="text-gray-600">
              Page {meta.page} of {meta.totalPages}
            </span>
            <button
              disabled={page >= meta.totalPages}
              onClick={() => setPage(page + 1)}
              className="bg-gray-200 px-3 py-1.5 hover:bg-gray-300 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
