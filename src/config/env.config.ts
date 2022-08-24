export default () => ({
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10),
  jwt: {
    refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
    accessTokenKey: process.env.ACCESS_TOKEN_KEY,
  },
  db: {
    url: process.env.DATABASE_URL,
  },
});
