import { generateAccessToken } from "../utils/paypalAccessToken.js";
import Order from "../models/orderSchema.js"; // Import the Order model
import Bid from '../models/bidsSchema.js'
import User from '../models/userSchema.js'
import Wallet from "../models/walletSchema.js";
import MESSAGES from "../constants/messages.js";
import { getIo } from "../socket.js";
import Task from "../models/taskSchema.js";
import mongoose from "mongoose";

async function getPayoutStatus(payoutBatchId, accessToken) {
  const response = await fetch(
    `${process.env.PAYPAL_API_URL}/v1/payments/payouts/${payoutBatchId}?fields=all`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();
  return data;
}

async function pollPayoutStatus(payoutBatchId, accessToken, maxAttempts = 6, delayMs = 2000) {
  const TERMINAL_STATUSES = [
    'SUCCESS', 'FAILED', 'RETURNED', 'ONHOLD',
    'BLOCKED', 'REFUNDED', 'REVERSED', 'UNCLAIMED', 'DENIED'
  ];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(
      `${process.env.PAYPAL_API_URL}/v1/payments/payouts/${payoutBatchId}?fields=all`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await res.json();
    const item = data.items?.[0]; // single-item batch, so index 0 is safe
    const itemStatus = item?.transaction_status;

    console.log(`Poll attempt ${attempt}: item status = ${itemStatus}`);

    if (itemStatus && TERMINAL_STATUSES.includes(itemStatus)) {
      return {
        success: itemStatus === 'SUCCESS',
        stage: 'final',
        batchStatus: data.batch_header?.batch_status,
        itemStatus,
        payoutItemId: item.payout_item_id,
        transactionId: item.transaction_id,
        errors: item.errors || null,
        raw: data
      };
    }

    if (attempt < maxAttempts) {
      await new Promise(r => setTimeout(r, delayMs));
    }
  }

  // Still not resolved after polling — don't block the caller forever
  return {
    success: null, // unknown yet
    stage: 'still_pending',
    message: 'Payout is still processing after polling window. Rely on webhook for final confirmation.',
    payoutBatchId
  };
}

async function payoutTransferService (receiverEmail, amount, currency) {
  
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

    if (!response.ok) {
      return {
        success: false,
        stage: 'create',
        error: data
      };
    }

    const payoutBatchId = data.batch_header.payout_batch_id;

    const finalStatus = await pollPayoutStatus( payoutBatchId, accessToken )

    console.log("finalStatus", finalStatus);
    
    
  } catch (error) {
    console.log("error", error);
    return { success: false, stage: 'exception', error: error.message };
  }
}

export const createOrderService = async (orderDetails) => {

  console.log(orderDetails);
  
    try {
        const { items, totalAmount, bidId } = orderDetails;
          
        // 1. Save the initial pending order to MongoDB
        const dbOrder = new Order({ items, totalAmount, status: 'Pending', bidId });
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
                  value: Number(totalAmount).toFixed(2), 
                  },
                  custom_id: dbOrder._id.toString(), 
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

export const captureOrderService = async ( orderId, user ) => {
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
    const dbOrder = await Order.findOne({ paypalOrderId: orderId });
    if (!dbOrder) {
      return { success: false, error: 'Order not found in database' };
    }
    if (dbOrder.status === 'Paid') {
      return { success: true, status: 'Success', message: 'Order already captured', order: dbOrder };
    }

    if (captureData.details?.[0]?.issue === 'ORDER_ALREADY_CAPTURED') {
      return { success: true, status: 'AlreadyCaptured', order: dbOrder };
    }

    if (captureData.details?.[0]?.issue === "INSTRUMENT_DECLINED") {
      return {
        success: true,
        status: "InstrumentDeclined",
        reason: "INSTRUMENT_DECLINED",
        data: captureData,
      };
    }
    
    if (!response.ok) {
      console.error('PayPal capture failed:', captureData);
      dbOrder.status = 'Failed';
      await dbOrder.save();
      return {
        success: false,
        status: 'Failed',
        reason: captureData?.details?.[0]?.issue || captureData?.name || 'UNKNOWN_ERROR',
        data: captureData,
      };
    }
    // console.log("captureData", captureData.purchase_units?.[0]?.payments?.captures?.[0]);
    
    // 2. Find the corresponding local order in MongoDB
   
    // 3. SECURE VERIFICATION: Check if PayPal successfully completed the capture
    const captureStatus = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.status;
    const statusReason = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.status_details?.reason;
    const capturedAmount = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value;
    const captureId = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id;
    const capturedCurrency = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.currency_code;
    
     if (captureStatus === "PENDING") {
      dbOrder.status = "Pending";
      dbOrder.paypalCaptureId = captureId;
      await dbOrder.save();
      return {
        success: true,
        status: "Pending",
        reason: statusReason || "PENDING_REVIEW",
        message: "Payment is pending review by PayPal. Awaiting final confirmation.",
        order: dbOrder,
      };
    }
 
    if (
      captureStatus === "COMPLETED" &&
      Number(capturedAmount) === Number(dbOrder.totalAmount) &&
      capturedCurrency === "USD" 
    ) {
      dbOrder.status = "Paid";
      dbOrder.paypalCaptureId = captureId;
      await dbOrder.save();
      const updatedPoster = await User.findOneAndUpdate(
        {_id: user._id},
        {$inc : {
          'poster.spent': Number(dbOrder.totalAmount),
          'poster.inEscrow': Number(dbOrder.totalAmount)
        }},
        {returnDocument: 'after'},
      )
      return { success: true, status: "Success", order: dbOrder };
    }
 
    if (captureStatus === "COMPLETED") {
      console.error("Amount/currency mismatch on completed capture", {
        capturedAmount,
        capturedCurrency,
        expectedAmount: dbOrder.totalAmount,
      });
      dbOrder.status = "Failed";
      dbOrder.paypalCaptureId = captureId; 
      await dbOrder.save();
      return { success: false, status: "Failed", reason: "AMOUNT_MISMATCH" };
    }
 
    dbOrder.status = "Failed";
    await dbOrder.save();
    return {
      success: false,
      status: "Failed",
      reason: captureStatus || "UNKNOWN_CAPTURE_STATUS",
      data: captureData,
    };
  } catch (error) {
    console.error('Error capturing order:', error);
    return { success: false, error: 'Failed to process capture' };
  }
}

export const orderPayoutService = async ({bidId, user}) => {
  console.log(bidId, user);
  try {
    const order = await Order.findOne({bidId}) 
    // console.log("order",order)
    const bid = await Bid.findById(bidId) 
    // console.log("bid",bid)
    const worker = await User.findOne({_id:bid.workerId}) 
    // console.log("worker",worker)
    const poster = await User.findOne({_id: user._id}) 
    // console.log("poster")
    const task = await Task.findOne({acceptedBid:bid._id})
    console.log("task ", task);
    
    
    if(order.totalAmount != bid.amount){
      return {success: false, message: MESSAGES.AMOUNT_MISMATCH};
    }
    // console.log("amount okay");
    
    const workerWallet = await Wallet.findOneAndUpdate(
      {userId: new mongoose.Types.ObjectId(bid.workerId) },
      {
        $inc: {
          walletAmount: Number(bid.amount),
          totalEarned: Number(bid.amount)
        },
      },
      {
        returnDocument: 'after', 
        upsert: true
      }
    );

    task.update = 'payment';
    await task.save();

    const io = getIo()

     io.to(`user:${bid.workerId}`).emit("payment-received", {
      taskTitle: task.title,
      amount: bid.amount,
    });


    poster.poster.inEscrow -= bid.amount;
    await poster.save();

    return {success: true, message: "Payment has been released to Worker"}
    
  } catch (error) {
    console.error(error)
    return {success: false, message: "Unexpected error occoured"}
  }
}