import { generateAccessToken } from "../utils/paypalAccessToken.js";
import Order from "../models/orderSchema.js"; // Import the Order model

export async function payoutTransferService (receiverEmail, amount, currency) {
  console.log("called payout");
  
  try {
    let accessToken = await generateAccessToken();
    const senderBatchId = `batch_${Date.now()}`; // Unique batch ID for this payout

    const payoutPayload = {
      sender_batch_header:{
        sender_batch_id: senderBatchId,
        email_subject: "You have a payout!",
        email_message: "You have received a payout! Thanks for using our service!",
        recipient_type: "EMAIL"
      },
      items:[
        {
          recipient_type: "EMAIL",
          amount: {
            value:parseFloat(amount).toFixed(2), // Ensure exactly 2 decimal places
            currency: currency || USD
          },
          receiver: receiverEmail,
          note: "Thank you for your business.",
          sender_item_id: `item_${Date.now()}` // Unique item ID for this payout
        }
      ]
    }

    const response = await fetch(`${process.env.PAYPAL_API_URL}/v1/payments/payouts`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payoutPayload)
    });
         
    const data = await response.json();
    console.log("Payout Response:", data);
    
  } catch (error) {
    console.log("error", error);
  }
}

export const createOrderService = async (orderDetails) => {
    try {
        const { items, totalAmount } = orderDetails;
            // 1. Save the initial pending order to MongoDB
        const dbOrder = new Order({ items, totalAmount, status: 'Pending' });
        await dbOrder.save();

        // 2. Request order creation from PayPal
        const accessToken = await generateAccessToken();
        const response = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
            {
                amount: {
                currency_code: 'USD',
                value: totalAmount.toFixed(2), // Ensure exactly 2 decimal places
                },
                custom_id: dbOrder._id.toString(), // Link your DB order ID to PayPal
            },
            ],
        }),
        });

        const paypalOrder = await response.json();

        // 3. Link the PayPal Order ID back to your database record
        dbOrder.paypalOrderId = paypalOrder.id;
        await dbOrder.save();
        console.log(paypalOrder);

        // Return the PayPal details back to the React frontend
        return {success : true, order: paypalOrder};
  } catch (error) {
    console.error('Error creating order:', error);
    return {success : false, error: 'Failed to create order'};
  }
}

export const captureOrderService = async ( orderId ) => {
    try {
    const accessToken = await generateAccessToken();

    // 1. Instruct PayPal to capture the funds
    const response = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const captureData = await response.json();
    // console.log("captureData", captureData.purchase_units?.[0]?.payments?.captures?.[0]);
    

    // 2. Find the corresponding local order in MongoDB
    const dbOrder = await Order.findOne({ paypalOrderId: orderId });
    if (!dbOrder) {
      return { success: false, error: 'Order not found in database' };
    }

    // 3. SECURE VERIFICATION: Check if PayPal successfully completed the capture
    const captureStatus = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.status;
    const captureId = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id;
    
    if (captureStatus === 'COMPLETED') {
      // Payment is fully verified
      dbOrder.status = 'Paid';
      dbOrder.paypalCaptureId = captureId;
      await dbOrder.save();

      return { success: true, status: 'Success', message: 'Payment verified and saved', order: dbOrder };
    } else {
      // Payment failed or is flagged as pending verification by PayPal fraud checks
      dbOrder.status = 'Failed';
      await dbOrder.save();

      return { success: false,  status: 'Failed', reason: captureStatus, data: captureData };
    }
  } catch (error) {
    console.error('Error capturing order:', error);
    return { success: false, error: 'Failed to process capture' };
  }
}