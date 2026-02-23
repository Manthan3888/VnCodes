import { getClient } from "./client.js";

export async function createOrder(payload) {
  const client = await getClient(false);
  const { data } = await client.post("/orders", payload);
  return data;
}

export async function getMyOrders() {
  const client = await getClient(false);
  const { data } = await client.get("/orders/me");
  return data;
}

export async function getOrdersAdmin() {
  const client = await getClient(true);
  const { data } = await client.get("/orders/admin");
  return data;
}

export async function updateOrderStatus(orderId, status) {
  const client = await getClient(true);
  const { data } = await client.patch(`/orders/${orderId}/status`, { status });
  return data;
}
