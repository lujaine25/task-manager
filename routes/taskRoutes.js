const express = require('express');
const router = express.Router(); //to create a mini Express app just for task routes


// Import controller functions
const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

// Define routes and link them to controller functions

// GET /tasks → get all tasks
router.get('/tasks', getAllTasks);

// POST /tasks → create a new task
router.post('/tasks', createTask);

// PUT /tasks/:id → update a task by ID
router.put('/tasks/:id', updateTask);

// DELETE /tasks/:id → delete a task by ID
router.delete('/tasks/:id', deleteTask);

module.exports = router;
