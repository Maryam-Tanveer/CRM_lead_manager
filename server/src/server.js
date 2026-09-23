require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      process.stdout.write(`Server running on port ${PORT}\n`);
    });
  } catch (error) {
    process.stderr.write(`Failed to start server: ${error.message}\n`);
    process.exit(1);
  }
};

startServer();


// nodemon restart trigger
