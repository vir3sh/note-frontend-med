import { useTasks } from "../context/TaskContext.jsx";

const FILTERS = ["all", "pending", "completed"];

export default function FilterBar() {
  const { filter, setFilter } = useTasks();
  return (
    <div className="mb-4 flex gap-2">
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize ${
            f === filter ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
