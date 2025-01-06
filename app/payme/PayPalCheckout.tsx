'use client';

import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import {
  createPayPalOrder,
  capturePayPalPayment,
} from '@/server/actions/paypal';
import { paypalConfig, OrderData } from '@/lib/paypal';

interface PayPalCheckoutProps {
  orderData: OrderData;
  onSuccess?: (details: unknown) => void;
  onError?: (error: unknown) => void;
}

export default function PayPalCheckout({
  orderData,
  onSuccess,
  onError,
}: PayPalCheckoutProps) {
  const [error, setError] = useState<string | null>(null);

  return (
    <PayPalScriptProvider options={paypalConfig}>
      {error && <div className="text-red-500 mb-4">Error: {error}</div>}
      <PayPalButtons
        style={{ layout: 'vertical' }}
        createOrder={async () => {
          try {
            const order = await createPayPalOrder(orderData);
            return order.id;
          } catch (err) {
            setError('Failed to create order');
            throw err;
          }
        }}
        onApprove={async (data) => {
          try {
            const details = await capturePayPalPayment(data.orderID);
            onSuccess?.(details);
            return details;
          } catch (err) {
            setError('Failed to capture payment');
            onError?.(err);
            throw err;
          }
        }}
        onError={(err) => {
          setError('PayPal Checkout error');
          onError?.(err);
        }}
      />
    </PayPalScriptProvider>
  );
}
