import mongoose from 'mongoose';

export const checkMongoConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Database connection unavailable',
      message: 'MongoDB is not connected. Please check your MongoDB Atlas IP whitelist settings.',
      readyState: mongoose.connection.readyState,
      states: {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      }
    });
  }
  next();
};


