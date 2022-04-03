import { User } from "entity/User";
import { sign } from "jsonwebtoken";
import { Response } from "express";

export const createAccessToken = (user: User) => {
    if (!process.env.ACCESS_TOKEN_SECRET)
        throw new Error("No access token declared inside .env file!");

    return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30m",
    });
};

export const createRefreshToken = (user: User) => {
    if (!process.env.REFRESH_TOKEN_SECRET)
        throw new Error("No refresh token declared inside .env file!");

    return sign(
        { userId: user.id, tokenVersion: user.tokenVersion },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "1d",
        }
    );
};

export const sendRefreshToken = (res: Response, token: string) => {
    //set refreshing token -> name, token, opts
    //we want to return a bit different secret code -> 'gkrergeqqe'
    res.cookie("jid", token, { httpOnly: true, path: "/refresh_token" });
};
