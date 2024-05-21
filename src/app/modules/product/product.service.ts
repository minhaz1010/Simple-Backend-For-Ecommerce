import { TProduct } from "./product.interface";
import { Product } from "./product.model";

// HACK: create product in database services
const createProductInDatabase = async (productData: TProduct) => {
  // INFO: here we are receiving refined data by zod validation safeParse
  const result = await Product.create(productData);
  return result;
};

// HACK: get all products from database services
const getAllProductsFromDatabase = async (query: string) => {
  //  INFO:: filtering if any query is given or not
  // INFO: regex will be applied in name and description field
  const regexCriteria = query
    ? {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      }
    : {};
  const result = await Product.find(regexCriteria);

  return result;
};

// HACK: get  a single product from database services

const getSingleProductFromDatabase = async (id: string) => {
  const result = await Product.findById(id);
  return result;
};

// HACK: update a product from database services
const updateAProductInDatabase = async (id: string, productData: TProduct) => {
  const result = await Product.findByIdAndUpdate(id, productData, {
    new: true,
  });
  return result;
};

// HACK: delete a product from database services

const deleteAProductFromDatabase = async (id: string) => {
  const result = await Product.findByIdAndDelete(id);
  return result;
};

export const ProductServices = {
  createProductInDatabase,
  getAllProductsFromDatabase,
  getSingleProductFromDatabase,
  updateAProductInDatabase,
  deleteAProductFromDatabase,
};
