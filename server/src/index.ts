import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- ROUTES ---

// 1. GET all tasks
app.get("/tasks", async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" }, // Show newest first
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
});

// 2. CREATE a task
app.post("/tasks", async (req: Request, res: Response) => {
  try {
    const { name, status } = req.body;

    // Basic validation
    if (!name) {
      res.status(400).json({ error: "Task name is required" });
      return;
    }

    const newTask = await prisma.task.create({
      data: {
        name,
        status: status || "Incomplete",
      },
    });
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Error creating task" });
  }
});

// 3. UPDATE a task (Mark complete/incomplete)
app.put("/tasks/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, name } = req.body;

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) }, // Convert string ID to Number for Postgres
      data: { status, name },
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Error updating task" });
  }
});

// 4. DELETE a task
app.delete("/tasks/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting task" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
