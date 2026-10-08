import { useTasks } from "../context/TaskContext.jsx";
import TaskItem from "./TaskItem.jsx";

export default function TaskList() {
  const { tasks, loading, meta, page, setPage } = useTasks();

  if (loading && tasks.length === 0) return <p className="text-center text-gray-500">Loading tasks...</p>;
  if (tasks.length === 0) return <p className="text-center text-gray-500">No tasks found.</p>;

  const pagerBtn = "rounded-md bg-gray-200 px-3 py-1.5 text-sm hover:bg-gray-300 disabled:opacity-40";

  return (
    <>
      <ul className="space-y-3">
        {tasks.map((t) => (
          <TaskItem key={t.id} task={t} />
        ))}
      </ul>
      {meta.totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <button className={pagerBtn} disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {meta.page} of {meta.totalPages}
          </span>
          <button className={pagerBtn} disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      )}
    </>
  );
}
