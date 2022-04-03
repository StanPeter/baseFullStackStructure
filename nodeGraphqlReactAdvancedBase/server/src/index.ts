import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";
import { createConnection } from "typeorm";
import { User } from "entity/User";
import cookieParser from "cookie-parser";
import cors from "cors";
import {
    createAccessToken,
    createRefreshToken,
    sendRefreshToken,
} from "utils/auth";
import { verify } from "jsonwebtoken";
import { PhrasesResolver } from "resolvers/PhrasesResolver";

(async () => {
    //define express server
    const app = express();

    //set cors manually
    app.use(
        cors({
            credentials: true,
            origin: "http://localhost:3000",
        })
    );

    //use cookie parser to get later cookies from req. in an object
    app.use(cookieParser());

    //loads from .env file
    dotenv.config();

    //a random route, just to try out
    app.get("/users", async (_req, res) => {
        const users = await User.find();

        res.json(users);
    });

    //a second random route, just to try out
    app.get("/users/:id", async (req, res) => {
        const user = await User.findOne({ where: { id: req.params.id } });

        if (!user) res.send("User not found");
        else res.json(user);
    });

    //refresh_token route to improve security and do this outside /graphql route
    app.post("/refresh_token", async (req, res) => {
        //get refresh token and validate
        const refreshToken = req.cookies.jid;

        if (!refreshToken) return res.send({ ok: false, accessToken: "" });

        let payload: any;
        try {
            //it will automatically throw an error if verify(whether token is valid and not expired) fails
            payload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
        } catch (error) {
            console.log(error, "error");
            return res.send({ ok: false, accessToken: "" });
        }

        //payload has property userId
        const user = await User.findOne({ id: payload.userId });

        if (!user) {
            console.log("User not found");
            return res.send({ ok: false, accessToken: "" });
        }

        //in case the token has been revoked before
        if (user.tokenVersion !== payload.tokenVersion) {
            console.log("Token version invalid");
            return res.send({ ok: false, accessToken: "" });
        }

        sendRefreshToken(res, createRefreshToken(user));
        return res.send({ ok: true, accessToken: createAccessToken(user) });
    });

    //connection for typeorm using ormconfig.json and its entities
    await createConnection();

    //define apolloserver for graphql
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver, PhrasesResolver],
        }),
        context: ({ req, res }) => ({ req, res }), //to have an access for req and res inside resolvers
    });

    //connect express server with apollo, cors are set manually so set here to false
    apolloServer.applyMiddleware({ app, cors: false });

    //run express server
    app.listen(4000, () => {
        console.log("Server started");
    });
})();

// createConnection()
//   .then(async (connection) => {
//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log("Here you can setup and run express/koa/any other framework.");
//   })
//   .catch((error) => console.log(error));
