'use server';

import { cookies } from 'next/headers';
import { createClient, getUser } from '@/lib/supabase/server';
import { generateAccessToken } from '@/lib/paypal';
import { increaseUserCredit } from '@/server/db/utils';
import { redirect } from 'next/navigation';

interface OrderData {
  amount: number;
  description: string;
}

const getPaypalAPIURL = () => {
  return process.env.NODE_ENV === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
};

export async function createPayPalOrder(orderData: OrderData) {
  try {
    const accessToken = await generateAccessToken();
    const apiURL = getPaypalAPIURL();

    // PayPal requires specific formatting for the amount
    const amount = Number(orderData.amount).toFixed(2);

    // Construct the order payload according to PayPal's requirements
    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: `order_${Date.now()}`, // Unique reference ID for this purchase unit
          amount: {
            currency_code: 'USD',
            value: amount,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: amount,
              },
            },
          },
          description: orderData.description,
          items: [
            {
              name: orderData.description,
              quantity: '1',
              unit_amount: {
                currency_code: 'USD',
                value: amount,
              },
            },
          ],
        },
      ],
      application_context: {
        brand_name: 'Remova',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: 'https://extrax.vercel.app/success',
        cancel_url: 'https://extrax.vercel.app/cancel',
      },
    };

    const response = await fetch(`${apiURL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(orderPayload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('PayPal API Error Response:', responseData);
      throw new Error(
        `PayPal API error: ${responseData.message || 'Unknown error'}`,
      );
    }

    return responseData;
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    throw error;
  }
}

export async function capturePayPalPayment(orderID: string) {
  try {
    const accessToken = await generateAccessToken();
    const apiURL = getPaypalAPIURL();

    const response = await fetch(
      `${apiURL}/v2/checkout/orders/${orderID}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          Prefer: 'return=representation',
        },
      },
    );

    const responseData = await response.json();

    if (!response.ok) {
      console.error('PayPal Capture Error Response:', responseData);
      throw new Error(
        `PayPal capture error: ${responseData.message || 'Unknown error'}`,
      );
    }

    const supabase = createClient(await cookies());
    const userResult = await supabase.auth.getUser();
    console.log('RESPONSE IS OK', userResult);
    if (!userResult.data?.user || userResult.error !== null) {
      throw new Error('UNAUTHENTICATED');
    }

    const {
      data: { user },
      error,
    } = await getUser();
    if (!user || error) {
      redirect('/login');
    }

    await increaseUserCredit(user!.id, 100);

    return responseData;
  } catch (error) {
    console.error('Error capturing PayPal payment:', error);
    throw error;
  }
}
