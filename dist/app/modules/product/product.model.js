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
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const variantSchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: [true, "A product variant must have a type"],
    },
    value: {
        type: String,
        required: [true, "A product variant must have a value"],
    },
});
const inventorySchema = new mongoose_1.Schema({
    quantity: {
        type: Number,
        required: [true, "A product must have a quantity"],
        min: [0, "Quantity must be a positive number"],
    },
    inStock: {
        type: Boolean,
        required: [true, "Please specify if the product is available or not"],
    },
});
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "A product must have a name"],
    },
    description: {
        type: String,
        required: [true, "A product must have a description"],
    },
    price: {
        type: Number,
        required: [true, "A product must have a price"],
        min: [0, "Price must be greater than 0"],
    },
    category: {
        type: String,
        required: [true, "A product must have a category"],
    },
    tags: {
        type: [String],
        required: [true, "A product must have at least one tag"],
    },
    variants: {
        type: [variantSchema],
        required: [true, "A product must have at least one variant"],
    },
    inventory: {
        type: inventorySchema,
        required: [true, "Inventory details must be provided"],
    },
});
productSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const isExist = yield exports.Product.findOne({
            $and: [
                { name: this.name },
                { price: this.price },
                { description: this.description }
            ]
        }).countDocuments();
        if (isExist > 0) {
            throw new Error("same product with name,description and price is already exist");
        }
        next();
    });
});
exports.Product = (0, mongoose_1.model)("Product", productSchema);
