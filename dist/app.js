"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const product_route_1 = require("./app/modules/product/product.route");
const order_route_1 = require("./app/modules/orders/order.route");
const app = (0, express_1.default)();
const corsConfig = {
    origin: "*",
    credential: true,
    methods: ['GET', 'POST', "PUT", "DELETE"]
};
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsConfig));
app.use("/api/products", product_route_1.ProductRoutes);
app.use("/api/orders", order_route_1.OrderRoutes);
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Hello from express world"
    });
});
app.all("*", (req, res) => {
    res.status(400).json({
        success: false,
        message: JSON.stringify("Route Not Found"),
    });
});
exports.default = app;
