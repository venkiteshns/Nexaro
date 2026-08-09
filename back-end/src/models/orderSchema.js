import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
  items: [{ 
    name: String, 
    price: Number, 
    quantity: Number 
  }],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  status: { type: String, 
    enum: ['Pending', 'Paid', 'Failed'], 
    default: 'Pending' 
  },
  paypalOrderId: { 
    type: String 
  }, 
  paypalCaptureId: { 
    type: String 
  },
  bidId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Bid'
  } 
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);
