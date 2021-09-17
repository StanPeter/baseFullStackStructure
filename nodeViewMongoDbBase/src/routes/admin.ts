import express from "express";

import {
    getAddProduct,
    getEditProduct,
    getProducts,
    postAddProduct,
    postDeleteProduct,
    postEditProduct,
} from "controllers/admin";

const router = express.Router();

// /admin/add-product => GET
// middlewares can be passed from left to right -> router.get("/add-product", middleware1, middleware2, getAddProduct);
// then will be executed with next()
router.get("/add-product", getAddProduct);

// /admin/products => GET
router.get("/products", getProducts);

// /admin/add-product => POST
router.post("/add-product", postAddProduct);

router.get("/edit-product/:productId", getEditProduct);

router.post("/edit-product", postEditProduct);

router.post("/delete-product", postDeleteProduct);

export default router;
