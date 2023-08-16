import http from "http"
import express, { Request } from "express"
import { readFileSync } from "fs"
import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from "@apollo/server/express4"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import resolvers from "./resolvers"
import session from "./middlewares/session"

export interface MyContext {
  req: Request
}

const main = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const typeDefs = readFileSync("./schema.graphql", { encoding: "utf8" })
  const apolloServer = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })
  await apolloServer.start()

  app.use(express.json())
  app.use(session())
  app.use(
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({ req }),
    })
  )

  const port = 8000
  httpServer.listen({ port })
  console.log(`🚀 Server ready at http://localhost:${port}/`)
}

main()
