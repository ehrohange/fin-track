import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., "Groceries", "Utilities"
    type: {
      type: String,
      enum: ["income", "expense", "savings"],
      required: true,
    },
    color: { type: String, default: "#000000" }, // optional (UI purposes)
  },
  { timestamps: true }
);

export default mongoose.model("Category", CategorySchema);
