import { Resolvers } from "./generated/graphql"
import prisma from "./prisma"

const resolvers: Resolvers = {
  Query: {
    getPost: (_, { id }) => prisma.post.findUnique({ where: { id } }),
    getPosts: () => prisma.post.findMany(),
  },

  Mutation: {
    createPost: (_, { title }) => prisma.post.create({ data: { title } }),
    updatePost: async (_, { id, title }) => {
      const post = await prisma.post.findUnique({ where: { id } })

      if (!post) return null

      return prisma.post.update({
        where: { id },
        data: {
          title: title || undefined,
        },
      })
    },
    deletePost: async (_, { id }) => {
      const post = await prisma.post.findFirst({ where: { id } })

      if (!post) return null

      await prisma.post.delete({ where: { id } })

      return true
    },
  },
}

export default resolvers
