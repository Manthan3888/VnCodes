import mongoose from "mongoose";
import { ORDER_STATUS } from "../utils/constants.js";

const orderItemSchema = new mongoose.Schema(
  {
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Template" },
    id: { type: String }, // legacy numeric id from frontend; optional
    title: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerEmail: { type: String, required: true, trim: true },
    customerName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, trim: true },
    items: [orderItemSchema],
    total: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ["INR", "USD"], default: "INR" },
    discountCode: { type: String, default: null },
    status: { type: String, enum: Object.values(ORDER_STATUS), default: ORDER_STATUS.PENDING },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

export const Order = mongoose.model("Order", orderSchema);
