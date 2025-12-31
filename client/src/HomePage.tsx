// client/src/HomePage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTasks, updateTask, deleteTask } from "./api";

// Define the interface for our data
interface Task {
  id: number;
  name: string;
  status: string;
}

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Fetch tasks on load
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === "Complete" ? "Incomplete" : "Complete";
    await updateTask(task.id, { status: newStatus });
    loadTasks(); // Refresh list
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    await deleteTask(id);
    loadTasks(); // Refresh list
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>My To-Do List</h1>
      <Link to="/add">
        <button style={{ marginBottom: "20px", padding: "10px 20px" }}>
          + Add New Task
        </button>
      </Link>

      <div>
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: task.status === "Complete" ? "#f0f0f0" : "white",
            }}>
            <div>
              <span
                style={{
                  textDecoration:
                    task.status === "Complete" ? "line-through" : "none",
                  fontWeight: "bold",
                }}>
                {task.name}
              </span>
              <div style={{ fontSize: "0.8rem", color: "#666" }}>
                {task.status}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => toggleStatus(task)}>
                {task.status === "Complete" ? "Undo" : "Complete"}
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                style={{ backgroundColor: "#ff4444", color: "white" }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
