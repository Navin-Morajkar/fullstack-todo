import axios from "axios";

// If VITE_API_URL is set (Production), use it. Otherwise use localhost.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_URL,
});

export const getTasks = (status?: string, search?: string) => {
  return api.get("/tasks", {
    params: { status, search },
  });
};

export const addTask = (name: string, status: string) =>
  api.post("/tasks", { name, status });

export const updateTask = (
  id: number,
  data: { status?: string; name?: string }
) => api.put(`/tasks/${id}`, data);

export const deleteTask = (id: number) => api.delete(`/tasks/${id}`);