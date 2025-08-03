const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI); //This line attempts to connect to a MongoDB database using Mongoose's connect method. 
    console.log("db connected");                                  // The connection string is retrieved from an environment variable named MONGODB_URI.
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB; //Finally, this line exports the connectDB function so that it can be imported and used in other files within the application. 
                            // This allows other parts of the application to establish a connection to the MongoDB database by calling this function.
