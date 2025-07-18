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

// POST create a new task
const createTask = (req, res) => {
  const tasks = readTasks();
  const newTask = {
    id: Date.now(),  // unique ID based on current time
    title: req.body.title, // take title from the POST body
    completed: false
  };
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
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
  createTask,
  updateTask,
  deleteTask
};
