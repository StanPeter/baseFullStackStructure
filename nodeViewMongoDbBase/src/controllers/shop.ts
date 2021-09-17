import { NextFunction, Request, Response } from "express";
//models
import Product from "models/Product";
import User, { CartInterface } from "models/User";

interface GetCartResponse {
    amount: Number;
    title: String;
    id?: Number;
}

interface GetOrdersResponse {
    orderId: Number;
    products: [
        {
            title: String;
            amount: Number;
        }
    ];
}

export const getProducts = async (
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    const products = await Product.find({ active: true });

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
    Product.findById(prodId)
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
        const user = await User.findOne({ userName: "Stan05" });
        if (!user) throw new Error("No user was found");

        let response: Array<GetCartResponse> = [];

        const carts = user.cart.items;

        for (const cart of carts) {
            const foundProduct = await Product.findById(cart.productId);

            response.push({
                amount: cart.quantity,
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
        const foundProduct = await Product.findById(req.body.productId);
        const foundUser = await User.findOne({ userName: "Stan05" });

        if (foundProduct && foundUser) {
            await foundUser.addToCart(foundProduct);
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
    try {
        const user = await User.findOne({ userName: "Stan05" });

        if (!user) throw new Error("No user was found");

        const newCartItems: Array<CartInterface> = user.cart.items.filter(
            (item) => item.productId != req.body.productId
        );

        await user.updateOne({ cart: { items: newCartItems } });

        res.redirect("/cart");
    } catch (e) {
        console.log(e, "error");
        throw new Error(e);
    }
};

interface GetOrdersResponse {
    orderId: Number;
    products: [
        {
            title: String;
            amount: Number;
        }
    ];
}

export const getOrders = async (
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    try {
        const user = await User.findOne({ userName: "Stan05" });
        if (!user) throw new Error("No user was found");

        let response: Array<GetOrdersResponse> = [];

        for (const order of user.orders.items) {
            const foundProduct = await Product.findById(order.productId);

            const indexOfexistingOrder = response.findIndex(
                (d) => d.orderId === order.orderId
            );

            if (indexOfexistingOrder !== -1) {
                //if doesn't exist
                response[indexOfexistingOrder].products.push({
                    amount: order.quantity,
                    title: foundProduct!.title,
                });
            } else {
                response.push({
                    orderId: order.orderId!,
                    products: [
                        {
                            amount: order.quantity,
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

export const postOrder = async (_req: Request, res: Response) => {
    try {
        const user = await User.findOne({ userName: "Stan05" });

        if (!user) throw new Error("user was not found");

        const previousItems = user.cart.items;

        await user.updateOne({
            orders: {
                items: previousItems,
            },
            cart: {
                items: [],
            },
        });

        res.redirect("/orders");
    } catch (e) {
        throw new Error(e);
    }
};
