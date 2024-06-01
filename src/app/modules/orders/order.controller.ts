import { Request, Response } from "express";
import { orderValidationSchema } from "./order.validation";
import { OrderServices } from "./order.services";
import { TOrders } from "./order.interface";

// NOTE: controller function to create a order
const createOrder = async (req: Request, res: Response) => {
  try {
    const parsedData = orderValidationSchema.safeParse(req.body);
    // INFO: if zod validation safeParse gives me false then it will throw an error

    if (!parsedData.success) {
      const message = JSON.stringify(parsedData.error);
      throw new Error(message);
    }

    const order = await OrderServices.createOrderInDatabase(
      parsedData.data as TOrders,
    );
    res.status(201).json({
      success: true,
      message: "Order created successfully!",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? (() => {
              try {
                return JSON.parse(error.message);
              } catch (e) {
                return { message: error.message };
              }
            })()
          : error,
    });
  }
};

// NOTE: controller function to show all order
const getAllOrder = async (req: Request, res: Response) => {
  try {
    // INFO: if query is given then query will be taken and not given then empty string will be the query
    let query: string = "";
    const { email } = req.query;
    // INFO: checking whether email is undefined or not
    if (email !== undefined) {
      if (typeof email === "string") {
        query = email;
      } else if (Array.isArray(email)) {
        query = email.join(" ");
      }
    }

    const order = await OrderServices.getAllOrderFromDatabase(query);
    // INFO: if there is no order then 'Orders not found' wii be shown
    if (order.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Orders fetched successfully!",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong ",
      error,
    });
  }
};

export const OrderCollection = {
  createOrder,
  getAllOrder,
};
