import { getClient } from "./client.js";

export async function register(name, email, password) {
  const client = await getClient(false);
  const { data } = await client.post("/auth/register", { name, email, password });
  return data;
}

export async function login(email, password) {
  const client = await getClient(false);
  const { data } = await client.post("/auth/login", { email, password });
  return data;
}

export async function me() {
  const client = await getClient(false);
  const { data } = await client.get("/auth/me");
  return data;
}

export async function adminLogin(email, password) {
  const client = await getClient(true);
  const { data } = await client.post("/auth/admin/login", { email, password });
  return data;
}

export async function adminMe() {
  const client = await getClient(true);
  const { data } = await client.get("/auth/admin/me");
  return data;
}
