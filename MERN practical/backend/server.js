require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(cors());                                                    // FIX 1: browser requests allow
app.use(express.json());                                            // FIX 2: JSON body parse
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // FIX 3: images serve (URL me /uploads/...)

// ===== Routes =====
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

startServer();
