const express = require('express');
const Expense = require('../models/Expense');
const jwt = require('jsonwebtoken'); // Ensure authentication
const router = express.Router();

// Middleware to extract user ID from JWT
const authenticateUser = (req, res, next) => {
  const token = req.cookies.token; 
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Fetch all expenses for the logged-in user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId });
    res.status(200).json({ expenses });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// **POST route to add an expense**
router.post('/', authenticateUser, async (req, res) => {
  const { amount, category, date, description } = req.body;

  if (!amount || !category || !date || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newExpense = new Expense({
      userId: req.userId, // Assign the logged-in user's ID
      amount,
      category,
      date,
      description
    });

    await newExpense.save();
    res.status(201).json({ message: 'Expense added successfully', expense: newExpense });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
