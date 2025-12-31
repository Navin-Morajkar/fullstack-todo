import { useEffect, useState } from "react";
import { FiArrowDown, FiArrowUp, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { AlertModal } from "../components/AlertModal/AlertModal";
import TaskList from "../components/TaskList/TaskList";
import { deleteTask, getTasks } from "../services/api";
import type { Task } from "../types/common";

const STATUS_OPTIONS = ["Incomplete", "In Progress", "In Review", "Done"];

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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
      
      <TaskList tasks={tasks} isLoading={isLoading} loadTasks={loadTasks} />

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
    </div>
  );
}
