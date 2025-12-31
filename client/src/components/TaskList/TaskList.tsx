import { Link, useNavigate } from "react-router-dom";
import { STATUS_OPTIONS } from "../../constants/common";
import { FiCalendar, FiEdit2, FiTrash2 } from "react-icons/fi";
import type { Task } from "../../types/common";
import { deleteTask, updateTask } from "../../services/api";
import { AlertModal } from "../AlertModal/AlertModal";
import { useState } from "react";
import { formatDate, getBadgeClass } from "../../helpers/common";

type TaskListProps = {
  tasks: Task[];
  isLoading: boolean;
  loadTasks: () => Promise<void>;
};

const TaskList = (props: TaskListProps) => {
  const { tasks, isLoading, loadTasks } = props;

  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  const executeDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete);
      setTaskToDelete(null); // Close modal
      loadTasks();
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    await updateTask(id, { status: newStatus });
    loadTasks();
  };

  const confirmDelete = (id: number) => {
    setTaskToDelete(id); // This triggers the modal to open
  };

  return (
    <div>
      {isLoading ? (
        <div className="loading-container" style={{ padding: "40px 0" }}>
          <span>Fetching tasks...</span>
        </div>
      ) : tasks.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "#94a3b8",
            marginTop: "40px",
          }}>
          <p>No tasks found.</p>
        </div>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className={`task-card ${
              task.status === "Done" ? "completed" : ""
            }`}>
            <div
              className="task-content"
              onClick={() => navigate(`/edit/${task.id}`)}
              style={{ cursor: "pointer" }}>
              <span className="task-title">{task.name}</span>
              {task.description && (
                <span className="task-desc">{task.description}</span>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                  <span className={getBadgeClass(task.status)}>
                    {task.status}
                  </span>
                  
                  <span style={{ 
                    fontSize: '0.8rem', 
                    color: '#94a3b8', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px' 
                  }}>
                    <FiCalendar size={12} /> {formatDate(task.createdAt)}
                  </span>
                </div>
            </div>

            <div className="actions">
              <select
                value={task.status}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => updateStatus(task.id, e.target.value)}
                className="status-select">
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <Link to={`/edit/${task.id}`}>
                <button className="btn-edit" title="Edit">
                  <FiEdit2 size={16} />
                </button>
              </Link>

              <button
                onClick={() => confirmDelete(task.id)}
                className="btn-delete"
                title="Delete">
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        ))
      )}
      <AlertModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        title="Delete Task?"
        message="Are you sure you want to delete this task? This action cannot be undone."
        type="danger"
        confirmText="Yes, Delete"
        onConfirm={executeDelete}
      />
    </div>
  );
};

export default TaskList;
