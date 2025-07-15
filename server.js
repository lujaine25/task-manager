const express = require('express'); // 1. Import express
const app = express();               // 2. Create the app
const taskRoutes = require('./routes/taskRoutes'); // 3. Import the router



app.use(express.json()); // 4. Load JSON middleware


app.use('/', taskRoutes); // 5. Register the routes

// Start the server
const PORT = process.env.PORT || 3000;  // 6. Choose a port
app.listen(PORT, () => {                // 7. Start the server
  console.log(` Server is running on port ${PORT}`);
});
 