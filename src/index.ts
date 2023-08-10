import http from "http"
import express from "express"
import { readFileSync } from "fs"
import { ApolloServer, BaseContext } from "@apollo/server"
import { expressMiddleware } from "@apollo/server/express4"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import resolvers from "./resolvers"

const main = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const typeDefs = readFileSync("./schema.graphql", { encoding: "utf8" })
  const apolloServer = new ApolloServer<BaseContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })
  await apolloServer.start()

  app.use(express.json())
  app.use(expressMiddleware(apolloServer))

  const port = 8000
  httpServer.listen({ port })
  console.log(`🚀 Server ready at http://localhost:${port}/`)
}

main()
