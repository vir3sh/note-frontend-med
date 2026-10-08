import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { api } from "../lib/api.js";

const initialState = {
  tasks: [],
  meta: { total: 0, page: 1, limit: 5, totalPages: 1 },
  filter: "all",
  page: 1,
  loading: true,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, loading: true, error: null };
    case "LOAD_SUCCESS":
      return {
        ...state,
        loading: false,
        tasks: action.tasks,
        meta: action.meta,
      };
    case "ERROR":
      return { ...state, loading: false, error: action.message };
    case "SET_FILTER":
      return { ...state, filter: action.filter, page: 1 };
    case "SET_PAGE":
      return { ...state, page: action.page };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { filter, page } = state;

  const load = useCallback(async () => {
    dispatch({ type: "LOAD_START" });
    try {
      const res = await api.list(filter, page);
      if (res.data.length === 0 && page > 1) {
        dispatch({ type: "SET_PAGE", page: page - 1 });
        return;
      }
      dispatch({ type: "LOAD_SUCCESS", tasks: res.data, meta: res.meta });
    } catch (e) {
      dispatch({ type: "ERROR", message: e.message });
    }
  }, [filter, page]);

  useEffect(() => {
    load();
  }, [load]);

  const addTask = async (title, description) => {
    try {
      await api.create({ title, description });
      if (page !== 1)
        dispatch({ type: "SET_PAGE", page: 1 }); 
      else await load();
      return true;
    } catch (e) {
      dispatch({ type: "ERROR", message: e.message });
      return false;
    }
  };

  const completeTask = async (id) => {
    try {
      await api.complete(id);
      await load();
    } catch (e) {
      dispatch({ type: "ERROR", message: e.message });
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.remove(id);
      await load();
    } catch (e) {
      dispatch({ type: "ERROR", message: e.message });
    }
  };

  const value = {
    ...state,
    addTask,
    completeTask,
    deleteTask,
    setFilter: (f) => dispatch({ type: "SET_FILTER", filter: f }),
    setPage: (p) => dispatch({ type: "SET_PAGE", page: p }),
    clearError: () => dispatch({ type: "CLEAR_ERROR" }),
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used inside <TaskProvider>");
  return ctx;
}
