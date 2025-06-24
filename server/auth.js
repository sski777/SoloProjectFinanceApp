import dotenv from "dotenv";
dotenv.config();

import { expressjwt as jwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

const audience = process.env.API_AUDIENCE;
const domain = process.env.AUTH0_DOMAIN;

export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`,
  }),
  audience: audience,
  issuer: `https://${domain}/`,
  algorithms: ["RS256"],
});
