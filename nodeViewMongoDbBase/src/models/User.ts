import { IProductDocument } from "models/Product";
import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

export interface CartInterface {
    productId: String;
    quantity: Number;
}

export interface OrderInterface {
    productId: String;
    quantity: Number;
    orderId?: Number;
}

// TS Interdace for the schema
interface IUser {
    id?: any;
    userName: string;
    email: string;
    hashedPassword: string;
    cart: { items: Array<CartInterface> };
    orders: { items: Array<OrderInterface> };
}

// TS Methods for the schema
interface IUserDocument extends IUser, Document {
    checkPassword: (password: string) => Promise<boolean>;
    addToCart: (product: IProductDocument) => Promise<boolean>;
}

// TS Static methods for the schema
interface IUserModel extends Model<IUserDocument> {
    findByUsername: (userName: string) => Promise<IUserDocument>;
    hashPassword: (password: string) => Promise<string>;
}

// Moongose Schema itself
const UserSchema: Schema<IUserDocument> = new Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],
    },
    orders: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
                orderId: {
                    type: Number,
                    default: Math.floor(Math.random() * 1000000),
                },
            },
        ],
    },
});

// adding Methods
UserSchema.methods.addToCart = async function (product: IProductDocument) {
    const cartProductIndex = this.cart.items.findIndex((cp: CartInterface) => {
        return cp.productId.toString() === product._id.toString();
    });

    const updatedCartItems = [...this.cart.items];

    //@ts-ignore
    if (cartProductIndex >= 0) updatedCartItems[cartProductIndex].quantity += 1;
    else updatedCartItems.push({ productId: product._id, quantity: 1 });

    this.cart = { items: updatedCartItems };

    return this.save();
};

UserSchema.methods.checkPassword = async function (password: string) {
    const result = await bcrypt.compare(password, this.hashedPassword);
    return result;
};

// adding static methods
UserSchema.statics.findByUsername = function (userName: string) {
    return this.findOne({ userName });
};

UserSchema.statics.hashPassword = async function (password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
};

// Create mongoose Model and export
const User = mongoose.model<IUserDocument, IUserModel>("User", UserSchema);
export default User;
