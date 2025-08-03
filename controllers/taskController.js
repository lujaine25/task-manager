const taskService = require('../services/taskService');

const getAllTasks = async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.userId);
    res.json(task);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.body.title, req.userId);
    res.status(201).json(task);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const updatedTask = await taskService.updateTask(req.params.id, req.body, req.userId);
    res.json(updatedTask);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const result = await taskService.deleteTask(req.params.id, req.userId);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
