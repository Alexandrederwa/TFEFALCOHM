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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const itemDetail_1 = require("./../entity/itemDetail");
const auth_1 = require("./../middlewares/auth");
const express_1 = require("express");
const errorHandler_1 = require("../utils/errorHandler");
const data_source_1 = require("../data-source");
const catchAsyncError_1 = __importDefault(require("../middlewares/catchAsyncError"));
const auth_2 = require("../middlewares/auth");
const Product_1 = require("../entity/Product");
const productRepository = data_source_1.AppDataSource.getRepository(Product_1.Product);
const itemDetailRepository = data_source_1.AppDataSource.getRepository(itemDetail_1.ItemDetail);
const getProducts = (0, catchAsyncError_1.default)((_, res, __) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productRepository.find();
        return res.json(products);
    }
    catch (error) {
        console.log(error);
        return res.json({ error: "Something went wrong" });
    }
}));
const addProduct = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { stock, name, image, price, category } = req.body;
    if (!stock)
        return next(new errorHandler_1.errorHandler("Stock cannot be empty", 400));
    if (!name)
        return next(new errorHandler_1.errorHandler("Name cannot be empty", 400));
    if (!image)
        return next(new errorHandler_1.errorHandler("Image cannot be empty", 400));
    if (!price)
        return next(new errorHandler_1.errorHandler("Price cannot be empty", 400));
    if (!category ||
        (category !== Product_1.ProductCaregories.DIGITAL &&
            category !== Product_1.ProductCaregories.MUSIC &&
            category !== Product_1.ProductCaregories.LIGHT)) {
        return next(new errorHandler_1.errorHandler("Invalid Category", 400));
    }
    try {
        const product = new Product_1.Product();
        product.category = category;
        product.stock = stock;
        product.name = name;
        product.price = price;
        product.image = image;
        yield productRepository.save(product);
        res.json(product);
    }
    catch (error) {
        console.log(error);
        return res.json({ error: "Something went wrong" });
    }
}));
const removeProduct = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        return next(new errorHandler_1.errorHandler("Invalid Id", 400));
    try {
        const found = yield productRepository.findOneBy({ id });
        if (!found)
            return next(new errorHandler_1.errorHandler("Product not found", 400));
        const done = yield productRepository.remove(found);
        if (done) {
            const itemDetail = yield itemDetailRepository.findOne({
                where: { productId: id },
            });
            if (itemDetail) {
                yield itemDetailRepository.remove(itemDetail);
            }
            return res.json({ success: true });
        }
    }
    catch (error) {
        console.log(error);
        return res.json({ error: "Something went wrong" });
    }
}));
const updateProduct = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { stock, name, image, category, price } = req.body;
    if (!id)
        return next(new errorHandler_1.errorHandler("Invalid Id", 400));
    try {
        const found = yield productRepository.findOneBy({ id });
        if (!found)
            return next(new errorHandler_1.errorHandler("Product not found", 400));
        if (category &&
            category !== Product_1.ProductCaregories.DIGITAL &&
            category !== Product_1.ProductCaregories.MUSIC &&
            category !== Product_1.ProductCaregories.LIGHT) {
            return next(new errorHandler_1.errorHandler("Invalid Category", 400));
        }
        if (stock)
            found.stock = stock;
        if (name)
            found.name = name;
        if (image)
            found.image = image;
        if (price)
            found.price = price;
        if (category == Product_1.ProductCaregories.DIGITAL ||
            category == Product_1.ProductCaregories.MUSIC ||
            category == Product_1.ProductCaregories.LIGHT)
            found.category = category;
        const updated = yield productRepository.save(found);
        if (updated) {
            const itemDetails = yield itemDetailRepository.find({
                where: { productId: updated.id },
            });
            for (let i = 0; i < (itemDetails === null || itemDetails === void 0 ? void 0 : itemDetails.length);) {
                const element = itemDetails[i];
                const itemDetail = yield itemDetailRepository.findOne({
                    where: { id: element.id },
                });
                if (!itemDetail)
                    return next(new errorHandler_1.errorHandler("Failed to updated quotes", 400));
                itemDetail.productCategory = updated.category;
                itemDetail.productImage = updated.image;
                itemDetail.productPrice = updated.price;
                itemDetail.productName = updated.name;
                yield itemDetailRepository.save(itemDetail);
                i++;
            }
        }
        return res.status(200).json(found);
    }
    catch (error) {
        console.log(error);
        return res.json({ error: "Something went wrong" });
    }
}));
const router = (0, express_1.Router)();
router.get("/all", getProducts);
router.post("/add", auth_1.SetAuthUser, auth_2.authMiddleware, (0, auth_2.authorizeRoles)("admin"), addProduct);
router.delete("/:id", auth_1.SetAuthUser, auth_2.authMiddleware, (0, auth_2.authorizeRoles)("admin"), removeProduct);
router.put("/:id", auth_1.SetAuthUser, auth_2.authMiddleware, (0, auth_2.authorizeRoles)("admin"), updateProduct);
exports.default = router;
//# sourceMappingURL=product.js.map