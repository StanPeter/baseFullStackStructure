import Sequelize, {
    Model,
    HasManyGetAssociationsMixin,
    Association,
    // ModelDefined,
    // DataTypes,
    // HasManyAddAssociationMixin,
    // HasManyHasAssociationMixin,
    // HasManyCountAssociationsMixin,
    // HasManyCreateAssociationMixin,
    // HasOneGetAssociationMixinOptions,
    // HasOneSetAssociationMixin,
    // HasManyRemoveAssociationMixin,
    // HasManyRemoveAssociationsMixin,
    // HasOneSetAssociationMixinOptions,
    // Optional,
    // HasManyAddAssociationsMixin,
    // HasManyHasAssociationsMixin,
} from "sequelize";
import sequelizeConnection from "util/database";
//models
import Cart from "models/Cart";
import Order from "./Order";

//parameters are visible in auto-completing under User._attributes()
interface UserAttributes {
    id?: number;
    userName: string;
    email: string;
    password: string;
}

export default class User extends Model<UserAttributes> {
    // access fields by User.userName
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public userName!: string;
    public email!: string;
    public password!: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // these will not exist until `Model.init` was called.
    // methods created by associations
    public getCarts!: HasManyGetAssociationsMixin<Cart>; // Note the null assertions!
    public getOrders!: HasManyGetAssociationsMixin<Order>; // Note the null assertions!
    // public countCarts!: HasManyCountAssociationsMixin;
    // public hasCart!: HasManyHasAssociationMixin<Cart, number>;
    // public hasCarts!: HasManyHasAssociationsMixin<Cart, Array<Cart>>;
    // public setCarts!: HasOneSetAssociationMixinOptions<Cart, number>;
    // public addCart!: HasManyAddAssociationMixin<Cart, number>;
    // public addCarts!: HasManyAddAssociationsMixin<Cart, number>;
    // public createCart!: HasManyCreateAssociationMixin<Cart>;
    // public removeCart!: HasManyRemoveAssociationMixin<Cart, number>;
    // public removeCarts!: HasManyRemoveAssociationsMixin<Cart, number>;

    // You can also pre-declare possible inclusions, these will only be populated if you
    // actively include a relation.
    public readonly carts?: Cart[];
    public readonly orders?: Order[];

    public static associations: {
        carts: Association<User, Cart>;
        orders: Association<User, Order>;
    };
}

User.init(
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        userName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeConnection,
        tableName: "Users",
    }
);
