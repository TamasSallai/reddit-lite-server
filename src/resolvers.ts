import { Resolvers } from "./generated/graphql"

const resolvers: Resolvers = {
  Query: {
    hello: () => "world",
  },
}

export default resolvers
