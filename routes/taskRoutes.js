const express = require('express');
const router = express.Router(); //to create a mini Express app just for task routes
const authenticate = require('../middleware/authMiddleware');

// Import controller functions
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

// Define routes and link them to controller functions
// All routes require authentication

// GET / → get all tasks
router.get('/', authenticate, getAllTasks);

// GET /:id → get a task by ID
router.get('/:id', authenticate, getTaskById);

// POST / → create a new task
router.post('/', authenticate, createTask);

// PUT /:id → update a task by ID
router.put('/:id', authenticate, updateTask);

// DELETE /:id → delete a task by ID
router.delete('/:id', authenticate, deleteTask);

module.exports = router;
