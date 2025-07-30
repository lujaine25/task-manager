const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const usersPath = path.join(__dirname, '../data/users.json');
const SECRET = process.env.JWT_SECRET; 
if (!SECRET) {
  throw new Error("JWT_SECRET is not set in .env file");
}

const readUsers = () => {
  if (!fs.existsSync(usersPath)) return [];
  const data = fs.readFileSync(usersPath, 'utf8');
  return data ? JSON.parse(data) : [];
};

const writeUsers = (users) => {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
};

//  Signup (hash password)
const signup = async (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  const existingUser = users.find(user => user.username === username);
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10); // saltRounds = 10

  const newUser = {
    id: Date.now(),
    username,
    password: hashedPassword,
    role: 'user' // Default role
  };

  users.push(newUser);
  writeUsers(users);
  res.status(201).json({ message: 'User created' });
};

// Login (compare password)
const login = async (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

 const token = jwt.sign({ userId: user.id, role: user.role }, SECRET, { expiresIn: '1y' }); // added the user role

  res.json({ token });
};

// Get all users
const getAllUsers = (req, res) => {
  const users = readUsers();
  res.json(users.map(u => ({ id: u.id, username: u.username })));
};

// Get user by ID
const getUserById = (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({ id: user.id, username: user.username });
};

// Update user
const updateUser = (req, res) => {
  const users = readUsers();
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'User not found' });

  users[index] = { ...users[index], ...req.body };
  writeUsers(users);
  res.json({ message: 'User updated' });
};

// Delete user
const deleteUser = (req, res) => {
  let users = readUsers();
  const initialLength = users.length;
  users = users.filter(u => u.id !== parseInt(req.params.id));

  if (users.length === initialLength) {
    return res.status(404).json({ message: 'User not found' });
  }

  writeUsers(users);
  res.json({ message: 'User deleted' });
};

module.exports = {
  signup,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
