import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Alert, LayoutAnimation } from "react-native";
import { Category, Priority } from "../constants/colors";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

export type Task = {
  id: string;
  title: string;
  note: string;
  category: Category;
  priority: Priority;
  dueDate: string | null;
  completed: boolean;
  createdAt: number;
};

export type TaskDraft = {
  title: string;
  note: string;
  category: Category;
  priority: Priority;
  dueDate: string | null;
};

type LastDeleted = { task: Task; index: number } | null;

type TasksContextType = {
  tasks: Task[];
  loading: boolean;
  lastDeleted: LastDeleted;
  addTask: (draft: TaskDraft) => Promise<void>;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  undoDelete: () => void;
  updateTask: (id: string, draft: TaskDraft) => void;
  clearAll: () => void;
  reload: () => Promise<void>;
};

export const TasksContext = createContext<TasksContextType | null>(null);

// Database (snake_case) se app (camelCase) ki shape
const fromRow = (r: any): Task => ({
  id: r.id,
  title: r.title,
  note: r.note ?? "",
  category: r.category,
  priority: r.priority,
  dueDate: r.due_date,
  completed: r.completed,
  createdAt: new Date(r.created_at).getTime(),
});

const toRow = (d: TaskDraft) => ({
  title: d.title,
  note: d.note,
  category: d.category,
  priority: d.priority,
  due_date: d.dueDate,
});

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDeleted, setLastDeleted] = useState<LastDeleted>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fail = (message: string) =>
    Alert.alert("Something went wrong", message);

  const reload = useCallback(async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      Alert.alert("Could not load tasks", error.message);
      return;
    }
    setTasks((data ?? []).map(fromRow));
  }, []);

  // Login hone par us user ke tasks load karo
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    reload().finally(() => setLoading(false));
  }, [user?.id, reload]);

  const addTask = async (draft: TaskDraft) => {
    const { data, error } = await supabase
      .from("tasks")
      .insert(toRow(draft))
      .select()
      .single();
    if (error) return fail(error.message);
    setTasks((prev) => [fromRow(data), ...prev]);
  };

  // Optimistic update: pehle screen badlo, phir database
  const toggleTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
    supabase
      .from("tasks")
      .update({ completed: !task.completed })
      .eq("id", id)
      .then(({ error }) => {
        if (error) {
          fail(error.message);
          reload();
        }
      });
  };

  const updateTask = (id: string, draft: TaskDraft) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...draft } : t)));
    supabase
      .from("tasks")
      .update(toRow(draft))
      .eq("id", id)
      .then(({ error }) => {
        if (error) {
          fail(error.message);
          reload();
        }
      });
  };

  const deleteTask = (id: string) => {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return;
    const task = tasks[index];

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setLastDeleted({ task, index });

    supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .then(({ error }) => {
        if (error) {
          fail(error.message);
          reload();
        }
      });

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setLastDeleted(null), 4000);
  };

  // Undo: wahi task same id ke saath dobara insert hota hai
  const undoDelete = async () => {
    if (!lastDeleted) return;
    const { task, index } = lastDeleted;
    setLastDeleted(null);
    if (timer.current) clearTimeout(timer.current);

    const { error } = await supabase.from("tasks").insert({
      id: task.id,
      ...toRow(task),
      completed: task.completed,
      created_at: new Date(task.createdAt).toISOString(),
    });
    if (error) return fail(error.message);

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks((prev) => {
      const next = [...prev];
      next.splice(Math.min(index, next.length), 0, task);
      return next;
    });
  };

  const clearAll = () => {
    if (!user) return;
    setTasks([]);
    setLastDeleted(null);
    supabase
      .from("tasks")
      .delete()
      .eq("user_id", user.id)
      .then(({ error }) => {
        if (error) {
          fail(error.message);
          reload();
        }
      });
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        lastDeleted,
        addTask,
        toggleTask,
        deleteTask,
        undoDelete,
        updateTask,
        clearAll,
        reload,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
