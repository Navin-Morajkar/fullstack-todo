import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTasks, updateTask, deleteTask } from "../services/api";
import type { Task } from "../types/common";
import { STATUS_OPTIONS } from "../constants/common";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTasks();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, filterStatus, sortBy, sortOrder]); // Re-fetch when ANY of these change

  const loadTasks = async () => {
    try {
      // Send all params to backend
      const res = await getTasks(filterStatus, searchQuery, sortBy, sortOrder);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    await updateTask(id, { status: newStatus });
    loadTasks();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    await deleteTask(id);
    loadTasks();
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="container">
      <h1>My To-Do List</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <Link to="/add" style={{ flex: 1 }}>
          <button className="btn-primary">+ Add New Task</button>
        </Link>
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '10px', 
        marginBottom: '20px', 
        padding: '15px', 
        background: '#fff', 
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        
        {/* Search & Filter Status */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 2 }}
          />
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ flex: 1 }}
          >
            <option value="All">Filter: All</option>
            {STATUS_OPTIONS.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Sorting Controls */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{whiteSpace: 'nowrap', fontSize: '0.9rem', color: '#666'}}>Sort by:</label>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{ flex: 1 }}
          >
            <option value="createdAt">Date Created</option>
            <option value="name">Task Name</option>
            <option value="status">Status</option>
          </select>

          <button 
            onClick={toggleSortOrder}
            style={{ 
              background: '#e0e7ff', 
              color: '#4338ca',
              minWidth: '50px' 
            }}
            title={sortOrder === 'asc' ? "Ascending (A-Z)" : "Descending (Z-A)"}
          >
            {sortOrder === 'asc' ? '⬆ Asc' : '⬇ Desc'}
          </button>
        </div>

      </div>

      <div>
        {tasks.length === 0 && <p style={{textAlign: 'center', color: '#666'}}>No tasks found.</p>}
        
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className={`task-card ${task.status === 'Done' ? 'completed' : ''}`}
          >
            <div>
              <span className="task-name" style={{ display: 'block', fontSize: '1.1rem', fontWeight: 'bold' }}>
                {task.name}
              </span>
              <span style={{ 
                fontSize: '0.8rem', 
                padding: '2px 8px', 
                borderRadius: '12px', 
                background: '#e0e7ff', 
                color: '#4338ca' 
              }}>
                {task.status}
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '5px' }}>
              <select 
                value={task.status} 
                onChange={(e) => updateStatus(task.id, e.target.value)}
                style={{ width: 'auto', padding: '5px', fontSize: '0.9rem' }}
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <button 
                onClick={() => handleDelete(task.id)} 
                className="btn-delete"
                style={{ padding: '5px 10px' }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
