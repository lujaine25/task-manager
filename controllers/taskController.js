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

const getTaskById = (req, res) => {
  const id = parseInt(req.params.id);
  const tasks = readTasks();
  const userId = req.userId; // Get from authenticated user
  
  const task = tasks.find(task => task.id === id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  // Check if the task belongs to the authenticated user
  if (task.userId !== userId) {
    return res.status(403).json({ message: 'Access denied: This task does not belong to you' });
  }

  res.json(task);
};



// POST create a new task
const createTask = (req, res) => {
  try {
    const tasks = readTasks();
    const { title } = req.body;
    const userId = req.userId; // Get from authenticated user

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTask = {
      id: Date.now(),
      title,
      completed: false,
      userId 
    };

    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: "Error creating task" });
  }
};

// PUT update an existing task
const updateTask = (req, res) => {
  const tasks = readTasks();
  const taskId = parseInt(req.params.id);
  const userId = req.userId; // Get from authenticated user
  const index = tasks.findIndex(task => task.id === taskId);

  if (index === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  // Check if the task belongs to the authenticated user
  if (tasks[index].userId !== userId) {
    return res.status(403).json({ message: 'Access denied: This task does not belong to you' });
  }

  // Prevent changing the userId
  const { userId: bodyUserId, ...updateData } = req.body;
  
  tasks[index] = { ...tasks[index], ...updateData };
  writeTasks(tasks);
  res.json(tasks[index]);
};

// DELETE a task
const deleteTask = (req, res) => {
  const tasks = readTasks();
  const taskId = parseInt(req.params.id);
  const userId = req.userId; // Get from authenticated user
  
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  // Check if the task belongs to the authenticated user
  if (tasks[taskIndex].userId !== userId) {
    return res.status(403).json({ message: 'Access denied: This task does not belong to you' });
  }

  const updatedTasks = tasks.filter(task => task.id !== taskId);
  writeTasks(updatedTasks);
  res.json({ message: 'Task deleted successfully' });
};

// Export all controller functions
module.exports = {
  getAllTasks,
  getTaskById ,
  createTask,
  updateTask,
  deleteTask
};
