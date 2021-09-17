import { NextFunction, Request, Response } from "express";
//models
import Product from "models/Product";
import Cart from "models/Cart";
import User from "models/User";

interface GetCardResponse {
    amount: number;
    title: String;
    id?: number;
}

interface GetOrdersResponse {
    orderId: number;
    products: [
        {
            title: String;
            amount: number;
        }
    ];
}

export const getProducts = async (
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    const products = await Product.findAll({ where: { active: true } });

    res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
    });
};

export const getProduct = (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId)
        .then((product: any) => {
            res.render("shop/product-detail", {
                product: product,
                pageTitle: product.title,
                path: "/products",
            });
        })
        .catch((err: string) => console.log(err));
};

export const getCart = async (
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    try {
        const user = await User.findByPk(1);
        if (!user) throw new Error("No user was found");

        let response: Array<GetCardResponse> = [];

        const carts = await user.getCarts();

        for (const cart of carts) {
            //one way of doing it
            // const hey = await cart.getProducts();
            const foundProduct = await Product.findByPk(cart.productId);

            response.push({
                amount: cart.amount,
                title: foundProduct!.title,
                id: foundProduct!.id,
            });
        }

        res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products: response,
        });
    } catch (e) {
        console.log(e, "error");
        throw new Error(e);
    }
};

export const postCart = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    try {
        //check whether the same product already exists in user's Cart
        const existingCart = await Cart.findOne({
            where: { productId: req.body.productId, userId: 1 },
        });

        if (existingCart) {
            existingCart.update({
                // ...existingCart.toJSON(),
                amount: ++existingCart.amount,
            });
        } else {
            Cart.create({
                productId: req.body.productId,
                userId: 1,
                amount: 1,
            });
        }

        res.redirect("/cart");
    } catch (e) {
        console.log(e, "error");
    }
};

export const postCartDeleteProduct = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const cart = await Cart.findOne({
        where: { productId: req.body.productId, userId: 1 },
    });

    if (!cart) throw new Error("No cart was found");

    cart.destroy();

    res.redirect("/cart");
};

export const getOrders = async (
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    try {
        const user = await User.findByPk(1);
        if (!user) throw new Error("No user was found");

        let response: Array<GetOrdersResponse> = [];

        const orders = await user.getOrders();

        for (const order of orders) {
            const foundProduct = await Product.findByPk(order.productId);

            const indexOfexistingOrder = response.findIndex(
                (d) => d.orderId === order.orderId
            );

            if (indexOfexistingOrder !== -1) {
                response[indexOfexistingOrder].products.push({
                    amount: order.amount,
                    title: foundProduct!.title,
                });
            } else {
                response.push({
                    orderId: order.orderId,
                    products: [
                        {
                            amount: order.amount,
                            title: foundProduct!.title,
                        },
                    ],
                });
            }
        }

        res.render("shop/orders", {
            path: "/orders",
            pageTitle: "Your Orders",
            orders: response,
        });
    } catch (e) {
        console.log(e, "error");
        throw new Error(e);
    }
};

export const getCheckout = (
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout",
    });
};

export const postOrder = async (_req: Request, _res: Response) => {
    alert("not implemnted yet");
};
