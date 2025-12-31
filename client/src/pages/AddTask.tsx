// client/src/AddTaskPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addTask } from "../services/api";

export default function AddTaskPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    await addTask(name, status, description);
    navigate("/"); // Go back home
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Add New Task</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Task Name:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
            required
          />
        </div>

        <div className="form-group">
          <label>Description (Optional):</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Status:
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ width: "100%", padding: "8px" }}>
            {/* MATCHES THE HOME PAGE OPTIONS */}
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="In Review">In Review</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <button type="submit" style={{ padding: "10px", marginTop: "10px" }}>
          Save Task
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          style={{ background: "grey" }}>
          Cancel
        </button>
      </form>
    </div>
  );
}
