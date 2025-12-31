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

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => loadTasks(), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, filterStatus, sortBy, sortOrder]);

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

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    await deleteTask(id);
    loadTasks();
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

      {/* 1. Main Action Button */}
      <div style={{ marginBottom: "24px" }}>
        <Link to="/add" style={{ textDecoration: "none" }}>
          <button className="btn-primary">
            <FiPlus size={20} /> Create New Task
          </button>
        </Link>
      </div>

      {/* 2. Controls Card */}
      <div className="controls-card">
        {/* Search Bar Wrapper (Fixed Overflow) */}
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
              style={{ cursor: "pointer" }} /* Visual cue */
            >
              <span className="task-title">{task.name}</span>
              {task.description && (
                <span className="task-desc">{task.description}</span>
              )}
              <span className={getBadgeClass(task.status)}>{task.status}</span>
            </div>

            <div className="actions">
              {/* NEW CLASS: status-select */}
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
                onClick={() => handleDelete(task.id)}
                className="btn-delete"
                title="Delete">
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
