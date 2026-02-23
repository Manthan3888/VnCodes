import { getClient } from "./client.js";

export async function getCategories() {
  const client = await getClient(false);
  const { data } = await client.get("/categories");
  return data;
}

export async function createCategory(payload) {
  const client = await getClient(true);
  const { data } = await client.post("/categories", payload);
  return data;
}

export async function updateCategory(id, payload) {
  const client = await getClient(true);
  const { data } = await client.put(`/categories/${id}`, payload);
  return data;
}

export async function deleteCategory(id) {
  const client = await getClient(true);
  const { data } = await client.delete(`/categories/${id}`);
  return data;
}
