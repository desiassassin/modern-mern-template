import { StatusCodes, ReasonPhrases } from "http-status-codes";
import jwt from "jsonwebtoken";
import { AUTH_COOKIE_NAME } from "../constants.js";

export function validateToken(req, res, next) {
     const { [AUTH_COOKIE_NAME]: authorization } = req.cookies;

     // authorization header is not present
     if (!authorization) return res.errorResponse(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED);

     const [type, accessToken] = authorization.split(" ");

     // token type is not `Bearer`
     if (type !== "Bearer") return res.errorResponse(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED);

     // token is not found
     if (!accessToken) return res.errorResponse(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED);

     try {
          req.user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
     } catch (error) {
          return res.clearCookie(AUTH_COOKIE_NAME).errorResponse(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED);
     }

     next();
}
