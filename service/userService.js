const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const usersPath = path.join(__dirname, '../data/users.json');
const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error("JWT_SECRET is not set in .env file");
}

// Helpers
const readUsers = () => {
  if (!fs.existsSync(usersPath)) return [];
  const data = fs.readFileSync(usersPath, 'utf8');
  return data ? JSON.parse(data) : [];
};

const writeUsers = (users) => {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
};

// Service functions
const signup = async ({ username, password }) => {
  const users = readUsers();
  if (users.find(user => user.username === username)) {
    throw { status: 400, message: 'User already exists' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now(),
    username,
    password: hashedPassword,
    role: 'user',
  };

  users.push(newUser);
  writeUsers(users);

  return { message: 'User created' };
};

const login = async ({ username, password }) => {
  const users = readUsers();
  const user = users.find(u => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw { status: 401, message: 'Invalid credentials' };
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, SECRET, { expiresIn: '1y' });

  return { token };
};

const getAllUsers = () => {
  const users = readUsers();
  return users.map(u => ({ id: u.id, username: u.username }));
};

const getUserById = (id) => {
  const users = readUsers();
  const user = users.find(u => u.id === parseInt(id));
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }
  return { id: user.id, username: user.username };
};

const updateUser = (id, updateData) => {
  const users = readUsers();
  const index = users.findIndex(u => u.id === parseInt(id));
  if (index === -1) {
    throw { status: 404, message: 'User not found' };
  }

  users[index] = { ...users[index], ...updateData };
  writeUsers(users);
  return { message: 'User updated' };
};

const deleteUser = (id) => {
  const users = readUsers();
  const filtered = users.filter(u => u.id !== parseInt(id));
  if (filtered.length === users.length) {
    throw { status: 404, message: 'User not found' };
  }

  writeUsers(filtered);
  return { message: 'User deleted' };
};

module.exports = {
  signup,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
