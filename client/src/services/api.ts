import axios from "axios";

// If VITE_API_URL is set (Production), use it. Otherwise use localhost.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_URL,
});

// Task List API
export const getTasks = (
  status?: string, 
  search?: string, 
  sortBy?: string, 
  order?: 'asc' | 'desc'
) => {
  return api.get('/tasks', {
    params: { status, search, sortBy, order }
  });
};

// Get task API
export const getTaskById = (id: number) => api.get(`/tasks/${id}`);

// Add new task API
export const addTask = (name: string, status: string, description: string) => 
  api.post('/tasks', { name, status, description });

// Update task API
export const updateTask = (id: number, data: { status?: string; name?: string; description?: string }) => 
  api.put(`/tasks/${id}`, data);

//  Delete task API
export const deleteTask = (id: number) => api.delete(`/tasks/${id}`);