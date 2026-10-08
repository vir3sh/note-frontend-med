import { useTasks } from "../context/TaskContext.jsx";

export default function TaskItem({ task }) {
  const { completeTask, deleteTask } = useTasks();
  const done = task.status === "completed";

  return (
    <li className="flex items-start justify-between gap-4 rounded-xl bg-white p-4 shadow-sm">
      <div className="min-w-0">
        <h3 className={`font-semibold ${done ? "text-gray-400 line-through" : ""}`}>{task.title}</h3>
        {task.description && <p className="mt-1 break-words text-gray-600">{task.description}</p>}
        <p className="mt-2 text-xs text-gray-500">
          <span
            className={`mr-2 rounded-full px-2 py-0.5 ${
              done ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
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
            onClick={() => completeTask(task.id)}
            className="rounded-md bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
          >
            Complete
          </button>
        )}
        <button
          onClick={() => deleteTask(task.id)}
          className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
