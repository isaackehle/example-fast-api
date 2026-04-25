const API_BASE_URL = 'http://localhost:8000';

export async function getOrders() {
  const response = await fetch(`${API_BASE_URL}/api/orders/`);
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return response.json();
}

export async function createOrder(orderData: any) {
  const response = await fetch(`${API_BASE_URL}/api/orders/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) {
    throw new Error('Failed to create order');
  }
  return response.json();
}