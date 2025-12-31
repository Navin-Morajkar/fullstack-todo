import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTaskById, updateTask } from '../services/api';

const STATUS_OPTIONS = ['To Do', 'In Progress', 'In Review', 'Done'];

export default function EditTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch the existing task data
  useEffect(() => {
    const fetchTask = async () => {
      if (!id) return;
      try {
        const res = await getTaskById(Number(id));
        setName(res.data.name);
        setDescription(res.data.description || '');
        setStatus(res.data.status);
        setLoading(false);
      } catch (err) {
        alert("Failed to load task");
        navigate('/');
      }
    };
    fetchTask();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    await updateTask(Number(id), { 
      name, 
      status, 
      description 
    });
    navigate('/');
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1>Edit Task</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Task Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
        </div>

        <div className="form-group">
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <button type="submit" className="btn-primary" style={{ marginBottom: '10px' }}>Save Changes</button>
        <button type="button" onClick={() => navigate('/')} style={{ width: '100%', background: '#9ca3af', color: 'white' }}>Cancel</button>
      </form>
    </div>
  );
}