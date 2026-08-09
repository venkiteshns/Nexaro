import { captureOrderService, createOrderService, orderPayoutService } from "../services/paymentServices.js";
import Status from '../constants/statusCodes.js'
import user from "../models/userSchema.js";
import STATUS_CODES from "../constants/statusCodes.js";

export const createOrder = async (req, res) => {
    const response = await createOrderService(req.body);
    if (response.success) {
        res.status(Status.CREATED).json(response.order);
    } else {
        res.status(Status.INTERNAL_SERVER_ERROR).json({ error: response.error });
    }
}

export const captureOrder = async (req, res) => {
    const response = await captureOrderService(req.params.orderId, req.user);
    console.log("response", response);
    if (response.success) {
        res.status(Status.OK).json({status: response.status, order: response.order });
    } else {
        res.status(Status.INTERNAL_SERVER_ERROR).json({ error: response.error });
    }
}

export const orderPayout = async (req, res) => {

    let response = await orderPayoutService({bidId: req.params.bidId, user:req.user})
    // console.log(req.user, req.params.bidId);
    console.log(response);
    if(response.success){
        return res.status(STATUS_CODES.OK).json({success:true, message: response.message})
    }

    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({success:false, message:response.message})
    
}