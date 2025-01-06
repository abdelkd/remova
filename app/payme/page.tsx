'use client';

import PayPalCheckout from './PayPalCheckout';

export default function CheckoutPage() {
  const orderData = {
    id: '123',
    amount: 99.99,
    description: 'Example Product',
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <PayPalCheckout
        orderData={orderData}
        onSuccess={(details) => {
          console.log('Payment completed!', details);
          // Handle successful payment (e.g., update database, show success message)
        }}
        onError={(error) => {
          console.error('Payment failed:', error);
          // Handle payment error
        }}
      />
    </div>
  );
}
