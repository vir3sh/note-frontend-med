import { useTasks } from "../context/TaskContext.jsx";

export default function ErrorBanner() {
  const { error, clearError } = useTasks();
  if (!error) return null;
  return (
    <div role="alert" className="mb-4 flex items-center justify-between rounded-md bg-red-100 px-4 py-2 text-red-800">
      <span>{error}</span>
      <button onClick={clearError} className="px-2 text-xl leading-none" aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
