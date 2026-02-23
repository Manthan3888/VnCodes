import { getClient } from "./client.js";

export async function getAdminStats() {
  const client = await getClient(true);
  const { data } = await client.get("/admin/stats");
  return data;
}
