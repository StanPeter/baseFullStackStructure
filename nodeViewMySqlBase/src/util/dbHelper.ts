//mockData
import products from "data/products.json";
import users from "data/users.json";
import orders from "data/orders.json";
import carts from "data/carts.json";
//models
import Product from "models/Product";
import Cart from "models/Cart";
import User from "models/User";
import Order from "models/Order";

export const mockDataPopulater = async () => {
    users.forEach((user) => User.create(user));
    products.forEach((product) => Product.create(product));
    carts.forEach((cart) => Cart.create(cart));
    orders.forEach((order) => Order.create(order));
};

// relations of tables
export const setRelations = () => {
    User.hasMany(Cart, { foreignKey: "userId" });
    Cart.belongsTo(User, { foreignKey: "userId" });

    User.hasMany(Order, { foreignKey: "userId" });
    Order.belongsTo(User, { foreignKey: "userId" });

    //I do these relations manually as I disliked sequelize way of doing it
    // Product.belongsToMany(Cart, {
    //     through: "ProductCart",
    //     foreignKey: "productId",
    // });
    // Cart.belongsToMany(Product, {
    //     through: "ProductCart",
    //     foreignKey: "cartId",
    // });
};
