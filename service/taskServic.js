const Task = require('../models/Task');

// Get all tasks
const getAllTasks = async () => {
  return await Task.find().populate('userId', 'username');
};

// Get a task by ID
const getTaskById = async (taskId, userId) => {
  const task = await Task.findById(taskId).populate('userId', 'username');

  if (!task) {
    throw { status: 404, message: 'Task not found' };
  }

  if (task.userId._id.toString() !== userId) {
    throw { status: 403, message: 'Access denied: This task does not belong to you' };
  }

  return task;
};

// Create a new task
const createTask = async (title, userId) => {
  if (!title) {
    throw { status: 400, message: 'Title is required' };
  }

  const newTask = new Task({ title, userId });
  const savedTask = await newTask.save();
  await savedTask.populate('userId', 'username');
  return savedTask;
};

// Update task
const updateTask = async (taskId, updateData, userId) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw { status: 404, message: 'Task not found' };
  }

  if (task.userId.toString() !== userId) {
    throw { status: 403, message: 'Access denied: This task does not belong to you' };
  }

  delete updateData.userId; // Prevent userId change

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    updateData,
    { new: true, runValidators: true }
  ).populate('userId', 'username');

  return updatedTask;
};

// Delete task
const deleteTask = async (taskId, userId) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw { status: 404, message: 'Task not found' };
  }

  if (task.userId.toString() !== userId) {
    throw { status: 403, message: 'Access denied: This task does not belong to you' };
  }

  await Task.findByIdAndDelete(taskId);
  return { message: 'Task deleted successfully' };
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
