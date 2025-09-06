import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    amount: { type: Number, default: 0 },
    goalName: { type: String, required: true },
    goalAmount: { type: Number, required: true },
    goalStartDate: {type: Date, default: Date.now},
    goalDeadline: { type: Date, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Goal", GoalSchema);
