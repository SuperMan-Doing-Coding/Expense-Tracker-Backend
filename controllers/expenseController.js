const Expense = require('../models/Expense');

// Add a new expense
const addExpense = async (req, res) => {
  const { amount, category, date, description } = req.body;

  try {
    const expense = await Expense.create({
      userId: req.userId,
      amount,
      category,
      date,
      description,
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all expenses for a user
const getExpenses = async (req, res) => {
  const { page = 1, limit = 10, category, startDate, endDate } = req.query;

  try {
    const query = { userId: req.userId };
    if (category) query.category = category;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const expenses = await Expense.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Expense.countDocuments(query);

    res.status(200).json({
      expenses,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an expense
const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { amount, category, date, description } = req.body;

  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { amount, category, date, description },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an expense
const deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await Expense.findOneAndDelete({ _id: id, userId: req.userId });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addExpense, getExpenses, updateExpense, deleteExpense };