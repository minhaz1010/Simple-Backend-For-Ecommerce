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
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const product_model_1 = require("../product/product.model");
const orderSchema = new mongoose_1.Schema({
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
orderSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const check = yield product_model_1.Product.findById(this.productId);
        if (check === null) {
            const message = JSON.stringify("There is no such product");
            throw new Error(message);
        }
        const orderQuantity = this.quantity;
        const productid = this.productId;
        const productQuantity = yield product_model_1.Product.findOne({ _id: productid }); // INFO: calculate the product quantity
        const checkProductQuantity = (productQuantity === null || productQuantity === void 0 ? void 0 : productQuantity.inventory.quantity) - orderQuantity;
        if (!((productQuantity === null || productQuantity === void 0 ? void 0 : productQuantity.inventory.quantity) >= orderQuantity)) {
            const message = JSON.stringify("Product quantity is lesser than you have ordered");
            throw new Error(message);
        }
        if (checkProductQuantity > 0) {
            yield product_model_1.Product.findOneAndUpdate({ _id: productid }, {
                "inventory.quantity": checkProductQuantity,
            }, {
                new: true,
            });
        }
        else {
            yield product_model_1.Product.findOneAndUpdate({ _id: productid }, {
                "inventory.quantity": checkProductQuantity,
                "inventory.inStock": false,
            }, {
                new: true,
            });
        }
        next();
    });
});
exports.Order = (0, mongoose_1.model)("Order", orderSchema);
