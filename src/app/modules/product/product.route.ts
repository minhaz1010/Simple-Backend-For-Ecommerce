import e from "express";
import { ProductController } from "./product.controller";
import { ProductServices } from "./product.service";

const router = e.Router();

router.route("/").post(ProductController.createProduct).get(ProductController.getAllProducts);

router.route("/:productId").get(ProductController.getSingleProduct).put(ProductController.updateProduct).delete(ProductController.deleteAProduct)

export const ProductRoutes = router
