import { Schema, model } from "mongoose";
import { TOrders } from "./order.interface";
import { Product } from "../product/product.model";

const orderSchema = new Schema<TOrders>({
  email: {
    type: String,
    required: [true, "An email is needed for order"],
  },
  productId: {
    type: String,
    required: [true, "Product id is needed"],
  },
  price: {
    type: Number,
    required: [true, "Price is needed"],
  },
  quantity: {
    type: Number,
    required: [true, "quantity is needed"],
  },
});

// INFO: mongoose pre hooks for some extra queyr

orderSchema.pre("save", async function (next) {
  const check = await Product.findById(this.productId);

  if (check === null) {
    const message = JSON.stringify("There is no such product");
    throw new Error(message);
  }

  const orderQuantity = this.quantity;
  const productid = this.productId;
  const productQuantity = await Product.findOne({ _id: productid }); // INFO: calculate the product quantity

  const checkProductQuantity =
    (productQuantity?.inventory.quantity as number) - orderQuantity;

  if (!((productQuantity?.inventory.quantity as number) >= orderQuantity)) {
    const message = JSON.stringify(
      "Product quantity is lesser than you have ordered",
    );
    throw new Error(message);
  }

  if (checkProductQuantity > 0) {
    await Product.findOneAndUpdate(
      { _id: productid },
      {
        "inventory.quantity": checkProductQuantity,
      },
      {
        new: true,
      },
    );
  } else {
    await Product.findOneAndUpdate(
      { _id: productid },
      {
        "inventory.quantity": checkProductQuantity,
        "inventory.inStock": false,
      },
      {
        new: true,
      },
    );
  }
  next();
});

export const Order = model<TOrders>("Order", orderSchema);
