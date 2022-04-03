import { ApolloError } from "apollo-server-errors";
import { verify } from "jsonwebtoken";
import { ContextType } from "ts/ContextType";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<ContextType> = ({ context }, next) => {
    console.log(context, "context");

    const authorization = context.req.headers["authorization"];

    if (!authorization) throw new ApolloError("User is not authenticated: no token passed inside");

    try {
        const token = authorization.split(" ")[1];
        const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);

        context.payload = payload;
    } catch (error) {
        console.log(error, "Unfortunately, there was an error");
        throw new ApolloError("User's token is not valid");
    }

    return next();
};
