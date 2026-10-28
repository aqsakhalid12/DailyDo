import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Category } from "../constants/colors";

export type Task = {
  id: string;
  title: string;
  category: Category;
  completed: boolean;
};

type TasksContextType = {
  tasks: Task[];
  loading: boolean;
  addTask: (title: string, category: Category) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, title: string, category: Category) => void;
  clearAll: () => void;
};

export const TasksContext = createContext<TasksContextType | null>(null);
const STORAGE_KEY = "dailydo_tasks";

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // App start par tasks load karo
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((data) => {
        if (data) setTasks(JSON.parse(data));
      })
      .finally(() => setLoading(false));
  }, []);

  // Har change par save karo (load hone ke baad)
  useEffect(() => {
    if (!loading) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, loading]);

  const addTask = (title: string, category: Category) =>
    setTasks((prev) => [
      { id: Date.now().toString(), title, category, completed: false },
      ...prev,
    ]);

  const toggleTask = (id: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  const deleteTask = (id: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const updateTask = (id: string, title: string, category: Category) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title, category } : t))
    );

  const clearAll = () => setTasks([]);

  return (
    <TasksContext.Provider
      value={{ tasks, loading, addTask, toggleTask, deleteTask, updateTask, clearAll }}
    >
      {children}
    </TasksContext.Provider>
  );
}