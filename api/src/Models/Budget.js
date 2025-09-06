import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    categoryId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Category", 
      required: true 
    },
    amountLimit: { type: Number, required: true },
    period: { 
      type: String, 
      enum: ["monthly", "weekly", "custom"], 
      default: "monthly" 
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Budget", BudgetSchema);
