"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderCollection = void 0;
const order_validation_1 = require("./order.validation");
const order_services_1 = require("./order.services");
// NOTE: controller function to create a order
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedData = order_validation_1.orderValidationSchema.safeParse(req.body.order);
        if (!parsedData.success) {
            const message = JSON.stringify(parsedData.error);
            throw new Error(message);
        }
        const order = yield order_services_1.OrderServices.createOrderInDatabase(parsedData.data);
        res.status(201).json({
            success: true,
            message: "Order created successfully!",
            data: order,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "something went wrong",
            error: error instanceof Error ? JSON.parse(error.message) : error,
        });
    }
});
// NOTE: controller function to show all order
const getAllOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_services_1.OrderServices.getAllOrderFromDatabase();
        res.status(200).json({
            success: true,
            message: "Orders fetched successfully!",
            data: order,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Something went wrong ",
            error,
        });
    }
});
exports.OrderCollection = {
    createOrder,
    getAllOrder,
};
