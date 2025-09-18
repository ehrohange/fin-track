import Transaction from "../Models/Transaction.js";
import Category from "../Models/Category.js";
import { errorHandler } from "../utils/error.js";
import User from "../Models/User.js";
import Goal from "../Models/Goal.js";

export const createCategory = async (req, res, next) => {
  const { name, type, color } = req.body;
  try {
    if (!name || !type || !color)
      return next(errorHandler(400, "All fields are required."));
    const newCategory = await Category.create({ name, type, color });
    return res.status(201).json({
      message: "Category created successfully!",
      category: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    if (categories.length === 0)
      return next(errorHandler(404, "No categories found."));
    return res.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
};

export const getCategoriesByType = async (req, res, next) => {
  const { type } = req.params;
  try {
    const categories = await Category.find({ type });
    if (categories.length === 0)
      return next(errorHandler(404, "No categories found for this type."));
    return res.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
};

export const createTransaction = async (req, res, next) => {
  const { userId, categoryId } = req.params;
  const { amount, description, date } = req.body;

  try {
    if (!amount || !categoryId || !userId) {
      return next(
        errorHandler(400, "Amount, userId, and categoryId are required.")
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found."));
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return next(errorHandler(404, "Category not found."));
    }

    // Parse the date string like "Aug 30 2025"
    let parsedDate;
    if (date) {
      parsedDate = new Date(date); // JavaScript Date understands "Aug 30 2025"
      if (isNaN(parsedDate.getTime())) {
        return next(
          errorHandler(400, "Invalid date format. Use: 'Mmm XX XXXX'")
        );
      }
    } else {
      parsedDate = new Date();
    }

    const transaction = await Transaction.create({
      userId,
      amount,
      categoryId,
      description,
      date: parsedDate,
    });

    await Goal.findOneAndUpdate(
      {
        goalName: description,
        categoryId,
        userId,
        active: true,
      },
      { $inc: { amount: amount } }
    );

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate("categoryId", "name type color")
      .lean(); // return a plain JS object instead of a Mongoose doc

    // Format date into "Aug 30 2025"
    if (populatedTransaction.date) {
      populatedTransaction.date = new Date(
        populatedTransaction.date
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    }

    res.status(201).json({
      message: "Transaction created successfully!",
      transaction: populatedTransaction,
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactionsByUserId = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const transaction = await Transaction.find({ userId }).populate(
      "categoryId",
      "name type color"
    );
    return res.status(200).json({ transactions: transaction });
  } catch (error) {
    next(error);
  }
};

export const getTransactionsByUserIdAndDate = async (req, res, next) => {
  try {
    const { userId } = req.params;
    let { date } = req.query; // ⬅️ from query string

    if (!userId || !date) {
      return next(errorHandler(400, "User ID and Date are required."));
    }

    // 🛠 Normalize incoming date
    // Remove comma if present (handles both "Aug 25 2025" and "Aug 25, 2025")
    date = date.replace(",", "");

    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return next(errorHandler(400, "Invalid date format."));
    }

    const month = d.toLocaleString("en-US", { month: "short" });
    const day = d.getDate();
    const year = d.getFullYear();
    const formattedDate = `${month} ${day} ${year}`; // e.g. "Aug 25 2025"

    // ✅ Query DB
    const transactions = await Transaction.find({
      userId,
      date: formattedDate,
    }).populate("categoryId", "name type color");

    return res.status(200).json({ transactions });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const { userId, transactionId } = req.params;
    const user = await User.findById(userId);
    if (!user) return next(errorHandler(404, "User not found."));
    const transaction = await Transaction.findByIdAndDelete(transactionId);
    if (!transaction) return next(errorHandler(404, "Transaction not found."));
    return res.status(200).json({ message: "Transaction deleted!" });
  } catch (error) {
    next(error);
  }
};

export const createGoal = async (req, res, next) => {
  try {
    const { userId, categoryId } = req.params;

    const user = await User.findById(userId);
    if (!user) return next(errorHandler(404, "User not found."));

    const category = await Category.findById(categoryId);
    if (!category) return next(errorHandler(404, "Category not found,"));

    const { goalAmount, goalName, goalStartDate, goalDeadline } = req.body;
    if (!goalAmount || !goalName || !goalDeadline)
      return next(errorHandler(400, "All fields are required."));

    const goals = await Goal.find({
      userId,
      goalName,
      categoryId,
    });
    if (goals.length > 0)
      return next(errorHandler(400, "This goal already exists."));

    let parsedStartDate;
    if (goalStartDate) {
      parsedStartDate = new Date(goalStartDate);
      if (isNaN(parsedStartDate.getTime())) {
        return next(
          errorHandler(400, "Invalid date format. Use: 'Mmm XX XXXX'")
        );
      }
    } else {
      parsedStartDate = new Date();
    }

    let parsedDeadline;
    parsedDeadline = new Date(goalDeadline); // JavaScript Date understands "Aug 30 2025"
    if (isNaN(parsedDeadline.getTime())) {
      return next(errorHandler(400, "Invalid date format. Use: 'Mmm XX XXXX'"));
    }

    const goal = await Goal.create({
      userId,
      categoryId,
      amount: 0,
      goalAmount,
      goalName,
      goalStartDate: parsedStartDate,
      goalDeadline: parsedDeadline,
    });

    const populatedGoal = await Goal.findById(goal._id)
      .populate("categoryId", "name type color")
      .lean();

    if (populatedGoal.goalStartDate) {
      populatedGoal.goalStartDate = new Date(
        populatedGoal.goalStartDate
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    }

    if (populatedGoal.goalDeadline) {
      populatedGoal.goalDeadline = new Date(
        populatedGoal.goalDeadline
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    }

    res.status(201).json({
      message: "Goal added!",
      goal: populatedGoal,
    });
  } catch (error) {
    next(error);
  }
};

export const getGoals = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return next(errorHandler(404, "User not found."));

    const goals = await Goal.find({ userId })
      .populate("categoryId", "name type color") // populate categoryId
      .lean(); // return plain JS objects

    if (goals.length === 0)
      return res.status(200).json({ message: "No goals found.", goals: [] });

    // Format dates for each goal
    const formattedGoals = goals.map((goal) => {
      const formatted = { ...goal };

      if (formatted.goalStartDate) {
        formatted.goalStartDate = new Date(
          formatted.goalStartDate
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        });
      }

      if (formatted.goalDeadline) {
        formatted.goalDeadline = new Date(
          formatted.goalDeadline
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        });
      }

      return formatted;
    });

    return res.status(200).json({ goals: formattedGoals });
  } catch (error) {
    next(error);
  }
};

export const updateGoal = async (req, res, next) => {
  try {
    const { goalId } = req.params;
    const { goalAmount, goalDeadline, active } = req.body;

    const updateFields = {};
    if (goalAmount !== undefined) updateFields.goalAmount = goalAmount;
    if (goalDeadline !== undefined) updateFields.goalDeadline = goalDeadline;
    if (active !== undefined) updateFields.active = active;

    const updatedGoal = await Goal.findByIdAndUpdate(
      goalId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    if (!updatedGoal) return next(errorHandler(404, "Goal was not found."));
    return res
      .status(200)
      .json({ message: "Goal updated!", updatedGoal: updatedGoal });
  } catch (error) {
    next(error);
  }
};
