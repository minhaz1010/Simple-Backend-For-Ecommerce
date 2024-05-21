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
exports.ProductController = void 0;
const product_service_1 = require("./product.service");
const product_validation_1 = require("./product.validation");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body.product;
        const parsedData = product_validation_1.productValidationSchema.safeParse(data);
        if (!parsedData.success) {
            const message = JSON.stringify(parsedData.error);
            throw new Error(message);
        }
        const product = yield product_service_1.ProductServices.createProductInDatabase(parsedData.data);
        res.status(201).json({
            success: true,
            message: "Product created successfully!",
            data: product,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Something went wrong",
            error: error instanceof Error ? JSON.parse(error.message) : error,
        });
    }
});
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchTerm } = req.query;
        let query = "";
        if (typeof searchTerm === "string") {
            query = searchTerm;
        }
        else if (Array.isArray(searchTerm)) {
            query = searchTerm.join(" "); // Or handle as needed
        }
        // console.log(query, 'controller');
        const product = yield product_service_1.ProductServices.getAllProductsFromDatabase(query);
        res.status(200).json({
            success: true,
            message: "Products fetched successfully!",
            data: product,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Something went wrong to fetch the data",
            error,
        });
    }
});
const getSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const product = yield product_service_1.ProductServices.getSingleProductFromDatabase(productId);
        res.status(200).json({
            success: true,
            message: "Product fetched successfully!",
            data: product,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Something went wrong to fetch the data",
            error,
        });
    }
});
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const data = req.body;
        const parsedData = product_validation_1.productValidationSchema.partial().safeParse(data);
        if (!parsedData.success) {
            const message = JSON.stringify(parsedData.error);
            throw new Error(message);
        }
        const product = yield product_service_1.ProductServices.updateAProductInDatabase(productId, parsedData.data);
        res.status(200).json({
            success: true,
            message: "Product updated successfully!",
            data: product,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Something went wrong to fetch the data",
            error: error instanceof Error ? JSON.parse(error.message) : error,
        });
    }
});
const deleteAProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield product_service_1.ProductServices.deleteAProductFromDatabase(req.params.productId);
        res.status(200).json({
            success: true,
            message: "Product deleted successfully!",
            data: null,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Something went wrong to fetch the data",
            error,
        });
    }
});
exports.ProductController = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteAProduct,
};
