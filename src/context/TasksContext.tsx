import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useRef, useState } from "react";
import { LayoutAnimation } from "react-native";
import { Category, Priority } from "../constants/colors";

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
  addTask: (draft: TaskDraft) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  undoDelete: () => void;
  updateTask: (id: string, draft: TaskDraft) => void;
  clearAll: () => void;
};

export const TasksContext = createContext<TasksContextType | null>(null);
const STORAGE_KEY = "dailydo_tasks";

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDeleted, setLastDeleted] = useState<LastDeleted>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load saved tasks when the app starts
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((data) => {
        if (data) {
          const parsed = JSON.parse(data);
          // Older tasks may miss new fields, so give them defaults
          setTasks(
            parsed.map((t: any) => ({
              note: "",
              createdAt: Date.now(),
              priority: "Medium",
              dueDate: null,
              ...t,
            })),
          );
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Save on every change (after the first load)
  useEffect(() => {
    if (!loading) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, loading]);

  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current);
  };

  const addTask = (draft: TaskDraft) =>
    setTasks((prev) => [
      {
        id: Date.now().toString(),
        ...draft,
        completed: false,
        createdAt: Date.now(),
      },
      ...prev,
    ]);

  const toggleTask = (id: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );

  // Delete keeps the task in memory for a few seconds so it can be undone
  const deleteTask = (id: string) => {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return;
    const task = tasks[index];

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setLastDeleted({ task, index });

    clearTimer();
    timer.current = setTimeout(() => setLastDeleted(null), 4000);
  };

  const undoDelete = () => {
    if (!lastDeleted) return;
    const { task, index } = lastDeleted;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks((prev) => {
      const next = [...prev];
      next.splice(Math.min(index, next.length), 0, task);
      return next;
    });
    setLastDeleted(null);
    clearTimer();
  };

  const updateTask = (id: string, draft: TaskDraft) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...draft } : t)));

  const clearAll = () => {
    setTasks([]);
    setLastDeleted(null);
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
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
