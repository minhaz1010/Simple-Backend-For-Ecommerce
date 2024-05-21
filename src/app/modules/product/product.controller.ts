import { Request, Response } from "express";
import { ProductServices } from "./product.service";
import { productValidationSchema } from "./product.validation";
import { TProduct } from "./product.interface";

// INFO: product controller to create product 
const createProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body.product;
    const parsedData = productValidationSchema.safeParse(data);
    // INFO: if zod validation safeParse gives me false then i will throw an error 
    if (!parsedData.success) {
      const message = JSON.stringify(parsedData.error);
      throw new Error(message);
    }
    const product = await ProductServices.createProductInDatabase(
      parsedData.data as TProduct,
    );
    res.status(201).json({
      success: true,
      message: "Product Created Successfully!",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something Went Wrong To Create Product",
      error: error instanceof Error ? JSON.parse(error.message) : error,
    });
  }
};

// INFO: get all products controller 

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { searchTerm } = req.query;
    let query: string = "";
    // INFO: if query is given then the query will be taken and if not then query = ''
    if (searchTerm !== undefined) {
      if (typeof searchTerm === "string") {
        query = searchTerm;
      } else if (Array.isArray(searchTerm)) {
        query = searchTerm.join(" ");
      }
    }



    const product = await ProductServices.getAllProductsFromDatabase(query);
    // NOTE: checking whether product is in database or not 
    if (product.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Product Found"
      })
    }

    res.status(200).json({
      success: true,
      message: "Products Fetched Successfully!",
      data: product,
    });
  }
  catch (error) {
    res.status(400).json({
      success: false,
      message: "Something Went Wrong To Fetch The Data",
      error,
    });
  }
};
const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const product =
      await ProductServices.getSingleProductFromDatabase(productId);

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "No Product Found"
      })
    }
    res.status(200).json({
      success: true,
      message: "Product Fetched Successfully!",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something Went Wrong To Fetch The Data",
      error,
    });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const data = req.body;

    // NOTE: checking if any data is given or not .. if not then send a Response with that there is nothing to update
    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "There is nothing to update as you did not give any data"
      })
    }

    // INFO: if any data is given then checking validation by using zod and used partial 
    const parsedData = productValidationSchema.partial().safeParse(data);
    // INFO: if zod validation parsedData success is false then it will throw error 
    if (!parsedData.success) {
      const message = JSON.stringify(parsedData.error);
      throw new Error(message);
    }
    const product = await ProductServices.updateAProductInDatabase(
      productId,
      parsedData.data as TProduct,
    );
    res.status(200).json({
      success: true,
      message: "Product Updated Successfully!",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong to update the data",
      error: error instanceof Error ? JSON.parse(error.message) : error,
    });
  }
};

const deleteAProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductServices.deleteAProductFromDatabase(req.params.productId);
    console.log(product);

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Sorry There Is No Such Product To Delete"
      })
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully!",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong to delete the data",
      error,
    });
  }
};

export const ProductController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteAProduct,
};
