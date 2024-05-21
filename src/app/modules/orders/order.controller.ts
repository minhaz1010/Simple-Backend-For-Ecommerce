import { Request, Response } from "express";
import { orderValidationSchema } from "./order.validation";
import { OrderServices } from "./order.services";
import { TOrders } from "./order.interface";
import { Order } from "./order.model";

// NOTE: controller function to create a order
const createOrder = async (req: Request, res: Response) => {
  try {
    const parsedData = orderValidationSchema.safeParse(req.body.order);
    if (!parsedData.success) {
      const message = JSON.stringify(parsedData.error);
      throw new Error(message)
    }
    const order = await OrderServices.createOrderInDatabase(parsedData.data as TOrders);
    res.status(201).json({
      success: true,
      message: "Order created successfully!",
      data: order
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'something went wrong',
      error: error instanceof Error ? JSON.parse(error.message) : error
    });
  }
}

// NOTE: controller function to show all order 
const getAllOrder = async (req: Request, res: Response) => {
  try {
    const order = await OrderServices.getAllOrderFromDatabase();
    res.status(200).json({
      success: true,
      message: "Orders fetched successfully!",
      data: order
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong ",
      error
    })
  }
}


export const OrderCollection = {
  createOrder,
  getAllOrder
}
