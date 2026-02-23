import { sendSuccess, sendError, HTTP } from "../utils/response.js";
import { Category } from "../models/Category.js";

export async function list(req, res, next) {
  try {
    const categories = await Category.find().sort({ label: 1 });
    return sendSuccess(res, HTTP.OK, {
      categories: categories.map((c) => ({ id: c.id, label: c.label, icon: c.icon || "" })),
    });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const category = await Category.create({
      id: req.body.id,
      label: req.body.label,
      icon: req.body.icon || "",
    });
    return sendSuccess(res, HTTP.CREATED, {
      category: { id: category.id, label: category.label, icon: category.icon },
    }, "Category created.");
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const category = await Category.findOneAndUpdate(
      { id: req.params.id },
      { $set: { label: req.body.label, icon: req.body.icon } },
      { new: true }
    );
    if (!category) return sendError(res, HTTP.NOT_FOUND, "Category not found.");
    return sendSuccess(res, HTTP.OK, {
      category: { id: category.id, label: category.label, icon: category.icon },
    }, "Category updated.");
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const result = await Category.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) return sendError(res, HTTP.NOT_FOUND, "Category not found.");
    return sendSuccess(res, HTTP.OK, {}, "Category deleted.");
  } catch (err) {
    next(err);
  }
}
