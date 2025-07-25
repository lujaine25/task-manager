const fs = require('fs');
const path = require('path');

// Get the full path to tasks.json
const dataPath = path.join(__dirname, '../data/tasks.json');

// Helper: Read tasks from the file
const readTasks = () => {
  if (!fs.existsSync(dataPath)) {
    return [];
  }
  const data = fs.readFileSync(dataPath, 'utf8');
  return data ? JSON.parse(data) : [];
};

// Helper: Write tasks to the file
const writeTasks = (tasks) => {
  fs.writeFileSync(dataPath, JSON.stringify(tasks, null, 2));
};

// GET all tasks
const getAllTasks = (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
};

// GET task by ID
const getTaskById = (req, res) => {
  const tasks = readTasks();
  const task = tasks.find(t => String(t.id) === req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
};

// POST create a new task
const createTask = (req, res) => {
  try {
    const tasks = readTasks();

    // Basic validation
    if (!req.body.title || typeof req.body.title !== 'string') {
      return res.status(400).json({ message: "Invalid task title" });
    }

    const newTask = {
      id: Date.now(), // unique ID based on current time
      title: req.body.title.trim(), // take title from the POST body
      completed: false
    };

    tasks.push(newTask);
    writeTasks(tasks);

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error while creating task" });
  }
};

// PUT update an existing task
const updateTask = (req, res) => {
  const tasks = readTasks();
  const taskId = parseInt(req.params.id);
  const index = tasks.findIndex(task => task.id === taskId);

  if (index === -1) {
    return res.status(404).send('Task not found');
  }

  tasks[index] = { ...tasks[index], ...req.body };
  writeTasks(tasks);
  res.json(tasks[index]);
};

// DELETE a task
const deleteTask = (req, res) => {
  const tasks = readTasks();
  const taskId = parseInt(req.params.id);
  const updatedTasks = tasks.filter(task => task.id !== taskId);

  if (tasks.length === updatedTasks.length) {
    return res.status(404).send('Task not found');
  }

  writeTasks(updatedTasks);
  res.send('Task deleted successfully');
};

// Export all controller functions
module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
