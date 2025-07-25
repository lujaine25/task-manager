const express = require('express');
const router = express.Router();

const {
  signup,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const authenticate = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminOnly');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected admin-only routes
router.use(authenticate); // check if user is logged in
router.use(adminOnly);    // check if user is admin

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
