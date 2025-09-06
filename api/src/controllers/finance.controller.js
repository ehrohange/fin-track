import Transaction from "../Models/Transaction.js";
import Category from "../Models/Category.js";
import { errorHandler } from "../utils/error.js";
import User from "../Models/User.js";

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
          errorHandler(400, "Invalid date format. Use: 'Aug 30 2025'")
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
    if (transaction.length === 0)
      return next(errorHandler(404, "No transactions found."));
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


