require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
// const connectDB = require('./db');

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/tasks', taskRoutes);
app.use('/users', userRoutes); 

app.get('/', (req, res) => {
  res.send('Welcome to the Task Manager API!');
}); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
