import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    header: { type: String, required: true },
    details: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Report", ReportSchema);