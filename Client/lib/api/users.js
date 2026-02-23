import { getClient } from "./client.js";

export async function getUsers() {
  const client = await getClient(true);
  const { data } = await client.get("/users");
  return data;
}

export async function deleteUser(id) {
  const client = await getClient(true);
  const { data } = await client.delete(`/users/${id}`);
  return data;
}
