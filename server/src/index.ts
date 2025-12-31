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

// GET tasks API
app.get("/tasks", async (req: Request, res: Response) => {
  try {
    const { status, search, sortBy, order } = req.query;

    // FILTER by `status`
    const whereClause: any = {};

    if (status && status !== "All") {
      whereClause.status = String(status);
    }

    // SEARCH by task name
    if (search) {
      whereClause.name = {
        contains: String(search),
        mode: "insensitive",
      };
    }

    // SORTING
    const sortField = (sortBy as string) || "createdAt";
    const sortOrder = (order as string) === "asc" ? "asc" : "desc";

    // Validate sortField to prevent crashing (only allow safe fields)
    const validSortFields = ["name", "status", "createdAt"];
    const finalSortField = validSortFields.includes(sortField)
      ? sortField
      : "createdAt";

    const tasks = await prisma.task.findMany({
      where: whereClause,
      orderBy: {
        [finalSortField]: sortOrder,
      },
    });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching tasks" });
  }
});

// GET task by ID
app.get('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
    });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching task' });
  }
});

// CREATE task API
app.post('/tasks', async (req: Request, res: Response) => {
  try {
    const { name, status, description } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Task name is required' });
      return;
    }
    const newTask = await prisma.task.create({
      data: {
        name,
        status: status || 'To Do',
        description: description || '', //
      },
    });
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Error creating task' });
  }
});

// UPDATE task API
app.put('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, name, description } = req.body;
    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: { status, name, description },
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Error updating task' });
  }
});

// DELETE task API
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
