'use client';

import { useEffect, useState } from 'react';
import { getOrders } from '@/lib/api';
import { Order } from '@/types/models';

export default function Page() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Orders Management</h1>

      {loading && <p>Loading orders...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && (
        <div>
          <p>Total Orders: {orders.length}</p>
          <ul>
            {orders.map((order, index) => (
              <li key={index} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc' }}>
                <strong>Order ID: {order.id}</strong>
                <pre>{JSON.stringify(order, null, 2)}</pre>
              </li>
            ))}
          </ul>
          {orders.length === 0 && <p>No orders found.</p>}
        </div>
      )}
    </main>
  );
}
