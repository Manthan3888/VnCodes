import { sendSuccess, sendError, HTTP } from "../utils/response.js";
import { Template } from "../models/Template.js";

function toTemplateResponse(doc) {
  if (!doc) return null;
  const t = doc.toObject ? doc.toObject() : doc;
  return {
    id: t._id.toString(),
    title: t.title,
    fullTitle: t.fullTitle || t.title,
    originalPrice: t.originalPrice,
    price: t.price,
    category: t.category,
    templateType: t.templateType || "paid",
    videoUrl: t.videoUrl,
    videoFileName: t.videoFileName,
    videoData: t.videoData,
    description: t.description,
    date: t.createdAt ? t.createdAt.toISOString().split("T")[0] : undefined,
  };
}

export async function list(req, res, next) {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    return sendSuccess(res, HTTP.OK, {
      templates: templates.map((t) => toTemplateResponse(t)),
    });
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return sendError(res, HTTP.NOT_FOUND, "Template not found.");
    return sendSuccess(res, HTTP.OK, { template: toTemplateResponse(template) });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const data = {
      title: req.body.title,
      fullTitle: req.body.fullTitle || req.body.title,
      originalPrice: req.body.originalPrice,
      price: req.body.price,
      category: req.body.category,
      templateType: req.body.templateType || "paid",
      videoUrl: req.body.videoUrl,
      videoFileName: req.body.videoFileName,
      description: req.body.description,
      videoData: req.body.videoData,
    };
    const template = await Template.create(data);
    return sendSuccess(res, HTTP.CREATED, { template: toTemplateResponse(template) }, "Template created.");
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const template = await Template.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          fullTitle: req.body.fullTitle,
          originalPrice: req.body.originalPrice,
          price: req.body.price,
          category: req.body.category,
          templateType: req.body.templateType,
          videoUrl: req.body.videoUrl,
          videoFileName: req.body.videoFileName,
          description: req.body.description,
          videoData: req.body.videoData,
        },
      },
      { new: true, runValidators: true }
    );
    if (!template) return sendError(res, HTTP.NOT_FOUND, "Template not found.");
    return sendSuccess(res, HTTP.OK, { template: toTemplateResponse(template) }, "Template updated.");
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const template = await Template.findByIdAndDelete(req.params.id);
    if (!template) return sendError(res, HTTP.NOT_FOUND, "Template not found.");
    return sendSuccess(res, HTTP.OK, {}, "Template deleted.");
  } catch (err) {
    next(err);
  }
}
