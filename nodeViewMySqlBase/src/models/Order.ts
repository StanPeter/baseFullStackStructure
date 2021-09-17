import Sequelize, { Model } from "sequelize";
import sequelizeConnection from "util/database";

//parameters are visible in auto-completing
interface OrderAttributes {
    id?: number;
    userId: number;
    productId: number;
    orderId: number;
    amount: number;
}

export default class Order extends Model<OrderAttributes> {
    // access fields by User.userName
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public userId!: number;
    public productId!: number;
    public orderId!: number;
    public amount!: number;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Order.init(
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: Sequelize.INTEGER,
        },
        productId: {
            type: Sequelize.INTEGER,
        },
        orderId: {
            type: Sequelize.INTEGER,
        },
        amount: {
            type: Sequelize.INTEGER,
            defaultValue: 1,
        },
    },
    {
        sequelize: sequelizeConnection,
        tableName: "Orders",
    }
);
