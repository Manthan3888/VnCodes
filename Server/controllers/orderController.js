import { sendSuccess, sendError, HTTP } from "../utils/response.js";
import { Order } from "../models/Order.js";
import { ORDER_STATUS } from "../utils/constants.js";

function toOrderResponse(doc) {
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    id: o._id.toString(),
    customerEmail: o.customerEmail,
    customerName: o.customerName,
    phoneNumber: o.phoneNumber,
    items: o.items,
    total: o.total,
    paymentMethod: o.paymentMethod || "INR",
    discountCode: o.discountCode,
    status: o.status,
    date: o.createdAt ? o.createdAt.toISOString() : undefined,
    userId: o.userId ? o.userId.toString() : undefined,
  };
}

export async function create(req, res, next) {
  try {
    const payload = {
      customerEmail: req.body.customerEmail,
      customerName: req.body.customerName,
      phoneNumber: req.body.phoneNumber || "",
      items: req.body.items.map((item) => ({
        templateId: item.templateId || undefined,
        id: item.id?.toString(),
        title: item.title,
        price: item.price,
        originalPrice: item.originalPrice,
        quantity: item.quantity,
      })),
      total: req.body.total,
      paymentMethod: req.body.paymentMethod || "INR",
      discountCode: req.body.discountCode || null,
      status: ORDER_STATUS.PENDING,
      userId: req.user?._id || undefined,
    };
    const order = await Order.create(payload);
    return sendSuccess(res, HTTP.CREATED, { order: toOrderResponse(order) }, "Order created.");
  } catch (err) {
    next(err);
  }
}

/** Create order without auth (guest checkout) - same body, no userId */
export async function createGuest(req, res, next) {
  try {
    const payload = {
      customerEmail: req.body.customerEmail,
      customerName: req.body.customerName,
      phoneNumber: req.body.phoneNumber || "",
      items: req.body.items.map((item) => ({
        templateId: item.templateId || undefined,
        id: item.id?.toString(),
        title: item.title,
        price: item.price,
        originalPrice: item.originalPrice,
        quantity: item.quantity,
      })),
      total: req.body.total,
      paymentMethod: req.body.paymentMethod || "INR",
      discountCode: req.body.discountCode || null,
      status: ORDER_STATUS.PENDING,
      userId: req.body.userId || undefined,
    };
    const order = await Order.create(payload);
    return sendSuccess(res, HTTP.CREATED, { order: toOrderResponse(order) }, "Order created.");
  } catch (err) {
    next(err);
  }
}

export async function listAdmin(req, res, next) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return sendSuccess(res, HTTP.OK, { orders: orders.map(toOrderResponse) });
  } catch (err) {
    next(err);
  }
}

export async function listMy(req, res, next) {
  try {
    const orders = await Order.find({ userId: req.user?._id }).sort({ createdAt: -1 });
    return sendSuccess(res, HTTP.OK, { orders: orders.map(toOrderResponse) });
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status: req.body.status } },
      { new: true }
    );
    if (!order) return sendError(res, HTTP.NOT_FOUND, "Order not found.");
    return sendSuccess(res, HTTP.OK, { order: toOrderResponse(order) }, "Status updated.");
  } catch (err) {
    next(err);
  }
}
