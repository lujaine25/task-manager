const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({   // Defines a new Mongoose schema for your Task model. This sets up the structure and rules for the documents in the tasks collection.
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true  // Automatically removes extra spaces at the start or end.
  },
  completed: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,     //special MongoDB ID format.
    ref: 'User',                              //Mongoose knows to look up the User model when you use .populate('userId').
    required: [true, 'User ID is required']
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Task', taskSchema);
