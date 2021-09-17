import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct {
    id?: any;
    title: String;
    price: number;
    imageUrl?: String;
    description?: String;
    active?: Boolean; //whether its a deleted product or not (in orders we still want to see it even if its deleted!)
    userId: String;
}

export interface IProductDocument extends IProduct, Document {}

interface IProductModel extends Model<IProductDocument> {}

const ProductSchema: Schema<IProductDocument> = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    active: {
        type: String,
        default: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
});

const Product = mongoose.model<IProductDocument, IProductModel>(
    "Product",
    ProductSchema
);
export default Product;
