import express, { Application } from "express";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
//routes
import adminRoutes from "routes/admin";
import shopRoutes from "routes/shop";
import errorController from "controllers/error";
//models
import User from "models/User";

//load enviroment variables
dotenv.config();

//constants
const app: Application = express();
const port = process.env.PORT ?? 3000;

//engine is in ejs || pug || mustache
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
//transfer POST/PUT data to the correct format
app.use(express.urlencoded({ extended: true })); //extended: true precises that the req.body object will contain values of any type instead of just strings.

// app.use((req, res, next) => {
//     console.log("trying middleware");

//     next();
// });

//routes
app.use("/admin", adminRoutes); //with pre-index /admin
app.use(shopRoutes);
app.use(errorController);

//self calling method to run server
(async () => {
    try {
        const time1 = new Date().getTime();

        // local database connection
        // mongoose.connect("mongodb://localhost:27017/test", {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        // });

        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ow0qg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );

        console.log((new Date().getTime() - time1) / 1000, "s Took this long");

        const saveUser = await User.findOne({ userName: "Stan05" });
        if (!saveUser)
            await User.create({
                userName: "Stan05",
                hashedPassword: await User.hashPassword("test"),
                email: "test@gmail.com",
                cart: [],
                orders: [],
            });

        app.listen(port, () => console.log("Listening on " + port));
    } catch (e) {
        throw new Error(e);
    }
})();
