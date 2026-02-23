import { getClient } from "./client.js";

export async function getTemplates() {
  const client = await getClient(false);
  const { data } = await client.get("/templates");
  return data;
}

export async function getTemplateById(id) {
  const client = await getClient(false);
  const { data } = await client.get(`/templates/${id}`);
  return data;
}

export async function createTemplate(payload, adminToken) {
  const client = await getClient(true);
  const { data } = await client.post("/templates", payload);
  return data;
}

export async function updateTemplate(id, payload) {
  const client = await getClient(true);
  const { data } = await client.put(`/templates/${id}`, payload);
  return data;
}

export async function deleteTemplate(id) {
  const client = await getClient(true);
  const { data } = await client.delete(`/templates/${id}`);
  return data;
}
