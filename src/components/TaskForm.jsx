import { useState } from "react";
import { useTasks } from "../context/TaskContext.jsx";

export default function TaskForm() {
  const { addTask } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setFieldError("Title is required");
    setFieldError("");
    setSubmitting(true);
    const ok = await addTask(title.trim(), description.trim());
    setSubmitting(false);
    if (ok) {
      setTitle("");
      setDescription("");
    }
  };

  const input = "w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="mb-6 space-y-3 rounded-xl bg-white p-4 shadow-sm">
      <div>
        <input
          className={input}
          placeholder="Task title *"
          value={title}
          maxLength={120}
          onChange={(e) => setTitle(e.target.value)}
        />
        {fieldError && <p className="mt-1 text-sm text-red-600">{fieldError}</p>}
      </div>
      <textarea
        className={input}
        rows={3}
        placeholder="Description (optional)"
        value={description}
        maxLength={1000}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}
