import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // slug e.g. "creator"
    label: { type: String, required: true, trim: true },
    icon: { type: String, default: "" },
  },
  { timestamps: true }
);

categorySchema.index({ id: 1 });

export const Category = mongoose.model("Category", categorySchema);
