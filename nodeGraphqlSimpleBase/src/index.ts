import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
// import { HelloWorldResolver } from "./resolvers/HelloWorldResolver";
// import { ShipResolver } from "./resolvers/ShipResolver";
import { CharacterResolver } from "./resolvers/CharacterResolver";

(async () => {
  const app = express();

  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      // resolvers: [HelloWorldResolver, ShipResolver, CharacterResolver],
      resolvers: [CharacterResolver],
    }),
    context: ({ req, res }) => ({ req, res })
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("express server started on port 4000 -> http://localhost:4000/graphql");
  });
})();
