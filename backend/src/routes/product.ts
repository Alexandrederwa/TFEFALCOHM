import { ItemDetail } from "./../entity/itemDetail";
import { SetAuthUser } from "./../middlewares/auth";
import { Router, Request, Response, NextFunction } from "express";
import { errorHandler } from "../utils/errorHandler";
import { AppDataSource } from "../data-source";

import catchAsyncError from "../middlewares/catchAsyncError";

import { authMiddleware, authorizeRoles } from "../middlewares/auth";
import { Product, ProductCaregories } from "../entity/Product";
// REPOITORIES TO DEAL WITH DATABASE
const productRepository = AppDataSource.getRepository(Product);
const itemDetailRepository = AppDataSource.getRepository(ItemDetail);
// GET ALL PRODUCTS ROUTE
const getProducts = catchAsyncError(
  async (_: Request, res: Response, __: NextFunction) => {
    try {
      const products = await productRepository.find();
      return res.json(products);
    } catch (error) {
      console.log(error);
      return res.json({ error: "Something went wrong" });
    }
  }
);


// ADMIN ADD PPODUCTS ROUTE
const addProduct = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { stock, name, image, price, category } = req.body;
    // INPUT VALIDATION
    if (!stock) return next(new errorHandler("Stock cannot be empty", 400));
    if (!name) return next(new errorHandler("Name cannot be empty", 400));
    if (!image) return next(new errorHandler("Image cannot be empty", 400));

    if (!price) return next(new errorHandler("Price cannot be empty", 400));
    // IF VALID CATEGORY
    if (
      !category ||
      (category !== ProductCaregories.DIGITAL &&
        category !== ProductCaregories.MUSIC &&
        category !== ProductCaregories.LIGHT)
    ) {
      return next(new errorHandler("Invalid Category", 400));
    }
    try {
      const product = new Product();
      product.category = category;
      product.stock = stock;
      product.name = name;
      product.price = price;
      product.image = image;

      await productRepository.save(product);
      res.json(product);
    } catch (error) {
      console.log(error);
      return res.json({ error: "Something went wrong" });
    }
  }
);
// ADMIN REMOVE PRODUCT
const removeProduct = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) return next(new errorHandler("Invalid Id", 400));
    try {
      const found = await productRepository.findOneBy({ id });
      if (!found) return next(new errorHandler("Product not found", 400));
      const done = await productRepository.remove(found);
      if (done) {
        // IF PRODUCT REMOVED THEN QUOTES ITEM WILL ALSO BE REMOVED
        const itemDetail = await itemDetailRepository.findOne({
          where: { productId: id },
        });
        if (itemDetail) {
          await itemDetailRepository.remove(itemDetail);
        }
        return res.json({ success: true });
      }
    } catch (error) {
      console.log(error);
      return res.json({ error: "Something went wrong" });
    }
  }
);
// ADMIN UPDATE PRODUCTS
const updateProduct = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { stock, name, image, category, price } = req.body;

    if (!id) return next(new errorHandler("Invalid Id", 400));
    try {
      const found = await productRepository.findOneBy({ id });
      if (!found) return next(new errorHandler("Product not found", 400));

      if (
        category &&
        category !== ProductCaregories.DIGITAL &&
        category !== ProductCaregories.MUSIC &&
        category !== ProductCaregories.LIGHT
      ) {
        return next(new errorHandler("Invalid Category", 400));
      }
      if (stock) found.stock = stock;
      if (name) found.name = name;
      if (image) found.image = image;

      if (price) found.price = price;
      if (
        category == ProductCaregories.DIGITAL ||
        category == ProductCaregories.MUSIC ||
        category == ProductCaregories.LIGHT
      )
        found.category = category;

      const updated = await productRepository.save(found);
      // IF PRODUCT UPDATED THEN UPDATE THE QUOTES ITEMS ALSO
      if (updated) {
        const itemDetails = await itemDetailRepository.find({
          where: { productId: updated.id },
        });

        for (let i = 0; i < itemDetails?.length; ) {
          const element = itemDetails[i];
          const itemDetail = await itemDetailRepository.findOne({
            where: { id: element.id },
          });
          if (!itemDetail)
            return next(new errorHandler("Failed to updated quotes", 400));
          itemDetail.productCategory = updated.category;
          itemDetail.productImage = updated.image;
          itemDetail.productPrice = updated.price;

          itemDetail.productName = updated.name;
          await itemDetailRepository.save(itemDetail);
          i++;
        }
      }

      return res.status(200).json(found);
    } catch (error) {
      console.log(error);
      return res.json({ error: "Something went wrong" });
    }
  }
);

const router = Router();
// OPEN ROUTES
router.get("/all", getProducts);

// ADMIN ROUTES
router.post(
  "/add",
  SetAuthUser,
  authMiddleware,
  authorizeRoles("admin"),
  addProduct
);
router.delete(
  "/:id",
  SetAuthUser,
  authMiddleware,
  authorizeRoles("admin"),
  removeProduct
);
router.put(
  "/:id",
  SetAuthUser,
  authMiddleware,
  authorizeRoles("admin"),
  updateProduct
);

export default router;
