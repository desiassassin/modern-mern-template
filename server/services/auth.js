import * as CONSTANTS from "../constants.js";
import { CLIENT } from "../server.js";
import JWT from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

async function createTokenAndSendAuthCookie(owner, res) {
     const token = JWT.sign(
          {
               email: owner.email,
               _id: owner._id
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: CONSTANTS.EXPIRY.TOKEN_EXPIRE_TIME }
     );
     return res
          .cookie(CONSTANTS.AUTH_COOKIE_NAME, `Bearer ${token}`, {
               path: "/",
               httpOnly: true,
               sameSite: "strict",
               domain: CLIENT.domain,
               maxAge: CONSTANTS.EXPIRY.TOKEN_COOKIE_EXPIRE_TIME
          })
          .apiResponse(StatusCodes.OK);
}

export default {
     createTokenAndSendAuthCookie
};
