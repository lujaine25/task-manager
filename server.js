const express = require('express');
const app = express();
const taskRoutes = require('./routes/taskRoutes');


require('dotenv').config();
app.use(express.json());
app.use('/tasks', taskRoutes);

const PORT = process.env.PORT || 3000 ;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
