// client/src/api.ts
import axios from 'axios';

// CHANGE THIS PORT if your server is still running on 5432
const API_URL = 'http://localhost:5000'; 

export const api = axios.create({
  baseURL: API_URL,
});

export const getTasks = () => api.get('/tasks');
export const addTask = (name: string, status: string) => api.post('/tasks', { name, status });
export const updateTask = (id: number, data: { status?: string; name?: string }) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id: number) => api.delete(`/tasks/${id}`);