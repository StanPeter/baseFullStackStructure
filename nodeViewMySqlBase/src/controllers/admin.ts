import { Request, Response } from "express";
import Product from "models/Product";
import Cart from "models/Cart";

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

    const product = await Product.findByPk(req.params.productId);

    if (!product) throw new Error("No product was found");

    res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
    });
};

export const postEditProduct = async (req: Request, res: Response) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

    const updatedProduct = await Product.findByPk(prodId);

    if (!updatedProduct) throw new Error("Product was not found");

    try {
        await updatedProduct.update({
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
    const products = await Product.findAll({ where: { active: true } });

    res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
    });
};

export const postDeleteProduct = async (req: Request, res: Response) => {
    const id = req.body.productId;

    try {
        await Cart.destroy({ where: { productId: id } });
        await Product.update({ active: false }, { where: { id } });

        res.redirect("/admin/products");
    } catch (e) {
        console.log(e, "error");
        throw new Error(e);
    }
};
