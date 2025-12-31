import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPlus } from "react-icons/fi";
import { addTask } from "../services/api";
import { STATUS_OPTIONS } from "../constants/common";

export default function AddTaskPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Incomplete");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await addTask(name, status, description);
      navigate("/");
    } catch (error) {
      console.error("Failed to add task", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="controls-card">
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}>
        <button
          onClick={() => navigate("/")}
          className="btn-icon"
          style={{ marginRight: "10px" }}
          title="Go Back">
          <FiArrowLeft size={24} />
        </button>
        <h1 style={{ margin: 0, fontSize: "2rem" }}>Create New Task</h1>
      </div>
        <form onSubmit={handleSubmit}>
          {/* Task Name */}
          <div className="form-group">
            <label>Task Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Fix Navigation Bug"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this task..."
              rows={4}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                fontFamily: "inherit",
                fontSize: "1rem",
                resize: "vertical",
              }}
            />
          </div>

          {/* Status Select */}
          <div className="form-group">
            <label>Initial Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ width: "100%" }}>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "15px", marginTop: "30px" }}>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
              style={{ flex: 2 }}>
              {isSubmitting ? (
                "Creating..."
              ) : (
                <>
                  <FiPlus size={20} /> Create Task
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              style={{
                flex: 1,
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                color: "#64748b",
              }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
