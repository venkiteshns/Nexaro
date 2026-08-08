import { captureOrderService, createOrderService } from "../services/paymentServices.js";
import Status from '../constants/statusCodes.js'

export const createOrder = async (req, res) => {
    const response = await createOrderService(req.body);
    if (response.success) {
        res.status(Status.CREATED).json(response.order);
    } else {
        res.status(Status.INTERNAL_SERVER_ERROR).json({ error: response.error });
    }
}

export const captureOrder = async (req, res) => {
    const response = await captureOrderService(req.params.orderId);
    console.log(response);
    if (response.success) {
        res.status(Status.OK).json({status: 'Success', order: response.order });
    } else {
        res.status(Status.INTERNAL_SERVER_ERROR).json({ error: response.error });
    }
}