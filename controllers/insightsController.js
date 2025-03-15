const Expense = require('../models/Expense');

// Get spending insights
const getSpendingInsights = async (req, res) => {
  try {
    const expenses = await Expense.aggregate([
      { $match: { userId: req.userId } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]);

    const totalSpending = expenses.reduce((sum, expense) => sum + expense.total, 0);
    const insights = expenses.map((expense) => ({
      category: expense._id,
      total: expense.total,
      percentage: ((expense.total / totalSpending) * 100).toFixed(2),
    }));

    res.status(200).json(insights);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getSpendingInsights };