import Sequelize, {
    Model,
    HasManyGetAssociationsMixin,
    Association,
} from "sequelize";
import sequelizeConnection from "util/database";
//models
import Product from "models/Product";

//parameters are visible in auto-completing under User._attributes()
interface CartAttributes {
    id?: number;
    userId: number;
    productId: number;
    amount: number;
}

export default class Cart extends Model<CartAttributes> {
    // access fields by User.userName
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public userId!: number;
    public productId!: number;
    public amount!: number;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // these will not exist until `Model.init` was called.
    // methods created by associations
    public getProducts!: HasManyGetAssociationsMixin<Product>; // Note the null assertions!

    public readonly products?: Product[];

    public static associations: {
        products: Association<Cart, Product>;
    };
}

Cart.init(
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            //foreign key
            type: Sequelize.INTEGER,
        },
        productId: {
            //foreign key
            type: Sequelize.INTEGER,
        },
        amount: {
            type: Sequelize.INTEGER,
            defaultValue: 1,
        },
    },
    {
        sequelize: sequelizeConnection,
        tableName: "Carts",
    }
);
