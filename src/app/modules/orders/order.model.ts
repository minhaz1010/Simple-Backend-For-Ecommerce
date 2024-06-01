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

// INFO: mongoose pre hooks for some extra query

orderSchema.pre("save", async function (next) {
  const existProduct = await Product.findById(this.productId);
  // NOTE: check if product is available or not
  if (existProduct === null) {
    const message = JSON.stringify("Order Not Found");
    throw new Error(message);
  }

  const orderQuantity = this.quantity;
  const productid = this.productId;
  const product = await Product.findOne({ _id: productid }); // INFO: get the product from product collection

  const checkProductQuantity =
    (product?.inventory.quantity as number) - orderQuantity;

  // INFO: if orderQuantity is greater than the  product quantity then it will throw an error
  if (!((product?.inventory.quantity as number) >= orderQuantity)) {
    const message = JSON.stringify(
      "Insufficient quantity available in inventory",
    );
    throw new Error(message);
  }

  if (checkProductQuantity > 0) {
    // NOTE: if product quantity > 0 then order will be place and quantity will be subtracted from order quantity
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
    // NOTE: if prodcut quantity < 0 then order will not be placed quantity will be 0 and inStock will be false
    await Product.findOneAndUpdate(
      { _id: productid },
      {
        "inventory.quantity": 0,
        "inventory.inStock": false,
      },
      {
        new: true,
      },
    );
  } // NOTE: if everything is okay then go to the next();
  next();
});

export const Order = model<TOrders>("Order", orderSchema);
