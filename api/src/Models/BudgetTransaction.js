import mongoose from "mongoose";

const budgetTransactionSchema = new mongoose.Schema(
  {
    userId: {
        type: String,
        required: true,
    },
    transDate: {
        type: Date,
        required: true,
    },
    transType: {
        type: String,
        required: true,
    },
    transName: {
        type: String,
        required: true,
    },
    transKind: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    }
  },
  {
    timestamps: true,
  }
);

const BudgetTransaction = mongoose.model("BudgetTransaction", budgetTransactionSchema);

export default BudgetTransaction;
