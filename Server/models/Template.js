import mongoose from "mongoose";
import { TEMPLATE_TYPE } from "../utils/constants.js";

const templateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    fullTitle: { type: String, trim: true },
    originalPrice: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    templateType: { type: String, enum: Object.values(TEMPLATE_TYPE), default: TEMPLATE_TYPE.PAID },
    videoUrl: { type: String, trim: true },
    videoFileName: { type: String, trim: true },
    description: { type: String, default: "" },
    // Optional: store small base64 thumbnail only; avoid full video in DB
    videoData: { type: String },
  },
  { timestamps: true }
);

templateSchema.index({ category: 1 });
templateSchema.index({ templateType: 1 });

export const Template = mongoose.model("Template", templateSchema);
