import { sendSuccess, HTTP } from "../utils/response.js";
import { Template } from "../models/Template.js";
import { Order } from "../models/Order.js";
import { User } from "../models/User.js";

export async function getStats(req, res, next) {
  try {
    const [totalTemplates, totalOrders, orders, totalUsers] = await Promise.all([
      Template.countDocuments(),
      Order.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(5).lean(),
      User.countDocuments(),
    ]);
    const totalRevenue = await Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]);
    const revenue = totalRevenue[0]?.total ?? 0;
    const recentOrders = orders.map((o) => ({
      id: o._id.toString(),
      customerEmail: o.customerEmail,
      total: o.total,
      date: o.createdAt?.toISOString?.() || o.date,
      status: o.status,
    }));
    return sendSuccess(res, HTTP.OK, {
      totalTemplates,
      totalOrders,
      totalRevenue: revenue,
      totalUsers,
      recentOrders,
    });
  } catch (err) {
    next(err);
  }
}
