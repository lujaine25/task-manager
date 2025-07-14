const express = require('express');
const app = express();
const taskRoutes = require('./routes/taskRoutes');

// Middleware to parse JSON bodies
app.use(express.json());

// Use the task routes for any request starting with "/"
app.use('/', taskRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
