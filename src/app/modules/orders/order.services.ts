import { TOrders } from "./order.interface";
import { Order } from "./order.model";

// NOTE: service function to create a order in database
const createOrderInDatabase = async (ordersData: TOrders) => {
  const result = await Order.create(ordersData);
  return result;
};

// NOTE: service function to get all order from database
const getAllOrderFromDatabase = async (query: string) => {
  // INFO: make the query more dynamic according to the logic
  let resultQuery = query ? { email: query } : {};

  const result = await Order.find(resultQuery);
  return result;
};

export const OrderServices = {
  createOrderInDatabase,
  getAllOrderFromDatabase,
};
