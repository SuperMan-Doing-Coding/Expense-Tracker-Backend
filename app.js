const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const insightsRoutes = require('./routes/insightsRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Updated CORS configuration to allow requests from deployed frontend
app.use(cors({
  origin: ['https://expense-tracker-frontend-7brx.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/insights', insightsRoutes);

// Error handling
app.use(errorHandler);

// Connect to MongoDB
connectDB();

module.exports = app;



// Middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
