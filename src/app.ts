import express, { Request, Response } from "express";
import cors from "cors";
import { ProductRoutes } from "./app/modules/product/product.route";
import { OrderRoutes } from "./app/modules/orders/order.route";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/products", ProductRoutes);
app.use("/api/orders", OrderRoutes);

app.get("/", (req, res) => {
  res.send("Hello mama kmn achos");
});

app.all("*", (req: Request, res: Response) => {
  res.status(400).json({
    success: false,
    message: "Route not found"
  })
})

export default app;
