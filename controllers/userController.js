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

// 🔐 Signup (hash password)
const signup = async (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  const existingUser = users.find(user => user.username === username);
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10); // saltRounds = 10

  const newUser = {
    id: Date.now(),
    username,
    password: hashedPassword
  };

  users.push(newUser);
  writeUsers(users);
  res.status(201).json({ message: 'User created' });
};

// 🔐 Login (compare password)
const login = async (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn:'1y'});
  res.json({ token });
};

module.exports = {
  signup,
  login
};
