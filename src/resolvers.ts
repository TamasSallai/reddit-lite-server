import prisma from "./prisma"
import bcrypt from "bcrypt"
import { Resolvers } from "./generated/graphql"

const resolvers: Resolvers = {
  Query: {
    me: (_, __, { req }) => {
      if (!req.session.userId) return null

      return prisma.user.findUnique({
        where: { id: req.session.userId },
      })
    },
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
    register: async (_, { email, username, password }) => {
      const passwordHash = await bcrypt.hash(password, 10)

      return prisma.user.create({
        data: {
          email,
          username,
          password: passwordHash,
        },
      })
    },
    login: async (_, { username, password }, { req }) => {
      const user = await prisma.user.findUnique({ where: { username } })

      if (!user) return null

      const isValid = await bcrypt.compare(password, user.password)

      if (!isValid) return null

      req.session.userId = user.id

      return user
    },
  },
}

export default resolvers
