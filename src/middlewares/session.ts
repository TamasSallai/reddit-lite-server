import session from "express-session"
import { createClient } from "redis"
import RedisStore from "connect-redis"

const redisClient = createClient()
redisClient.connect().catch((error) => console.log(error))

const redisStore = new RedisStore({
  client: redisClient,
})

export default () =>
  session({
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: "secret",
    cookie: {
      maxAge: 86400,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      //sameSite: "lax"
    },
  })
