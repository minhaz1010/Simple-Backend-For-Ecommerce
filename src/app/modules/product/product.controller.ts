import { Request, Response } from "express";
import { ProductServices } from "./product.service";
import { productValidationSchema } from "./product.validation";
import { TProduct } from "./product.interface";



const createProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body.product;
    const parsedData = productValidationSchema.safeParse(data);
    if (!parsedData.success) {
      const message = JSON.stringify(parsedData.error);
      throw new Error(message)
    }
    const product = await ProductServices.createProductInDatabase(parsedData.data as TProduct);
    res.status(201).json({
      success: true,
      message: "Product created successfully!",
      data: product
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: error instanceof Error ? JSON.parse(error.message) : error
    })
  }
}

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { searchTerm } = req.query;
    let query: string = '';

    if (typeof searchTerm === 'string') {
      query = searchTerm;
    } else if (Array.isArray(searchTerm)) {
      query = searchTerm.join(' '); // Or handle as needed
    }

    console.log(query, 'controller');

    const product = await ProductServices.getAllProductsFromDatabase(query);
    res.status(200).json({
      success: true,
      message: "Products fetched successfully!",
      data: product
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong to fetch the data",
      error
    })
  }
}
const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const product = await ProductServices.getSingleProductFromDatabase(productId);
    res.status(200).json({
      success: true,
      message: "Product fetched successfully!",
      data: product
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong to fetch the data",
      error
    })
  }

}


const updateProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const data = req.body;
    const parsedData = productValidationSchema.partial().safeParse(data);
    if (!parsedData.success) {
      const message = JSON.stringify(parsedData.error);
      throw new Error(message)
    }
    const product = await ProductServices.updateAProductInDatabase(productId, parsedData.data as TProduct);
    res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      data: product
    })

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong to fetch the data",
      error: error instanceof Error ? JSON.parse(error.message) : error
    })
  }

}

const deleteAProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductServices.deleteAProductFromDatabase(req.params.productId);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully!",
      data: null
    })

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong to fetch the data",
      error
    })
  }

}



export const ProductController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteAProduct
}
