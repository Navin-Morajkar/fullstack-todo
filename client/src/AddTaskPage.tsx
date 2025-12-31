// client/src/AddTaskPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addTask } from "./api";

export default function AddTaskPage() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Incomplete");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    await addTask(name, status);
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

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Status:
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ width: "100%", padding: "8px" }}>
            <option value="Incomplete">Incomplete</option>
            <option value="Complete">Complete</option>
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
