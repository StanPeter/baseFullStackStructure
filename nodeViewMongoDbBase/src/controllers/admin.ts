import { Request, Response } from "express";
import Product from "models/Product";

export const getAddProduct = (_req: Request, res: Response) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
    });
};

export const postAddProduct = async (req: Request, res: Response) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    try {
        await Product.create({
            title,
            price,
            imageUrl,
            description,
        });

        res.redirect("/");
    } catch (e) {
        console.log(e, "error");
        throw new Error(e);
    }
};

export const getEditProduct = async (req: Request, res: Response) => {
    const editMode = req.query.edit;
    if (!editMode) {
        console.log("Edit mode not passed!");
        return res.redirect("/");
    }

    const product = await Product.findById(req.params.productId);

    if (!product) throw new Error("No product was found");

    res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
    });
};

export const postEditProduct = async (req: Request, res: Response) => {
    const id = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

    try {
        await Product.findByIdAndUpdate(id, {
            title: updatedTitle,
            price: updatedPrice,
            imageUrl: updatedImageUrl,
            description: updatedDesc,
        });

        res.redirect("/admin/products");
    } catch (e) {
        console.log(e, "error");
        throw new Error("Unfortunately product coud not be updated");
    }
};

export const getProducts = async (_req: Request, res: Response) => {
    const products = await Product.find({ active: true });

    res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
    });
};

export const postDeleteProduct = async (req: Request, res: Response) => {
    const id = req.body.productId;

    try {
        await Product.findByIdAndUpdate(id, { active: false });

        res.redirect("/admin/products");
    } catch (e) {
        console.log(e, "error");
        throw new Error(e);
    }
};
