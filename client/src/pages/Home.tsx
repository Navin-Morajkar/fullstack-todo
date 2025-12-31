import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTasks, updateTask, deleteTask } from "../services/api";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import { AlertModal } from "../components/AlertModal/AlertModal";

interface Task {
  id: number;
  name: string;
  status: string;
  description?: string;
}

const STATUS_OPTIONS = ["Incomplete", "In Progress", "In Review", "Done"];

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => loadTasks(), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, filterStatus, sortBy, sortOrder]);

  useEffect(() => {
    const hasSeenWarning = sessionStorage.getItem("seen-warning");
    if (!hasSeenWarning) {
      setShowWelcomeModal(true);
      sessionStorage.setItem("seen-warning", "true");
    }
  }, []);

  const loadTasks = async () => {
    try {
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

  const confirmDelete = (id: number) => {
    setTaskToDelete(id); // This triggers the modal to open
  };

  const executeDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete);
      setTaskToDelete(null); // Close modal
      loadTasks();
    }
  };

  // Helper for Badge Colors
  const getBadgeClass = (status: string) => {
    switch (status) {
      case "Done":
        return "status-badge done";
      case "In Progress":
        return "status-badge in-progress";
      case "In Review":
        return "status-badge in-review";
      default:
        return "status-badge incomplete";
    }
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>

      {/* Main Action Button */}
      <div style={{ marginBottom: "24px" }}>
        <Link to="/add" style={{ textDecoration: "none" }}>
          <button className="btn-primary">
            <FiPlus size={20} /> Create New Task
          </button>
        </Link>
      </div>

      {/* Controls Card */}
      <div className="controls-card">
        <div className="search-wrapper">
          <input
            type="text"
            className="search-bar"
            placeholder="Search tasks by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters Row */}
        <div className="filters-row">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ flex: 1 }}>
            <option value="All">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ flex: 1 }}>
            <option value="createdAt">Date Created</option>
            <option value="name">Task Name</option>
            <option value="status">Status</option>
          </select>

          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            style={{
              background: "white",
              border: "1px solid #e2e8f0",
              minWidth: "100px",
              color: "#64748b",
            }}>
            {sortOrder === "asc" ? (
              <>
                <FiArrowUp /> Ascending
              </>
            ) : (
              <>
                <FiArrowDown /> Descending
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Task List */}
      <div>
        {tasks.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#94a3b8",
              marginTop: "40px",
            }}>
            <p>No tasks found.</p>
          </div>
        )}

        {tasks.map((task) => (
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
              <span className={getBadgeClass(task.status)}>{task.status}</span>
            </div>

            <div className="actions">
              <select
                value={task.status}
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
        ))}
      </div>
      <AlertModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        title="⚠️ Deployment Note"
        message={
          <>
            The backend is hosted on a <strong>Free Tier</strong> instance.
            <br />
            <br />
            It may take up to <strong>60 seconds</strong> to wake up for the
            first request. Please be patient if the data doesn't load
            immediately!
          </>
        }
      />
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
}
