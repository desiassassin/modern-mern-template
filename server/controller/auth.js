import { UserModel, ResetPasswordModel } from "../model/index.js";
import { CLIENT } from "../server.js";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { AUTH_COOKIE_NAME } from "../constants.js";
import Axios from "axios";
import * as CONSTANTS from "../constants.js";
import { compare, hash } from "bcrypt";
import AuthService from "../services/auth.js";
import Utils from "../utils/utils.js";
import moment from "moment-timezone";
import mail from "../services/mail.js";

const AuthController = {
     async registerPassword(req, res, next) {
          try {
               const { email, password, name } = req.body;

               // hash password
               const hasedPassword = await hash(password, 10);

               const ownerData = await UserModel.create({
                    email,
                    name,
                    password: hasedPassword,
                    auth: { method: CONSTANTS.AUTH_METHODS.PASSWORD, provider: CONSTANTS.AUTH_PROVIDERS.APP }
               });

               AuthService.createTokenAndSendAuthCookie(ownerData, res);
          } catch (error) {
               console.log(error);
               next(error);
          }
     },

     async loginPassword(req, res, next) {
          try {
               const { email, password } = req.body;

               // check if email is registerd
               const ownerData = await UserModel.findOne({ email });

               if (!ownerData) return res.clearCookie(AUTH_COOKIE_NAME).errorResponse(StatusCodes.BAD_REQUEST, "Email not registered.");

               if (ownerData.auth.method !== CONSTANTS.AUTH_METHODS.PASSWORD)
                    return res
                         .clearCookie(AUTH_COOKIE_NAME)
                         .errorResponse(
                              StatusCodes.BAD_REQUEST,
                              `Account registered using ${ownerData.auth.method}. Please sign in using ${ownerData.auth.provider} ${ownerData.auth.method}`
                         );

               // hash password
               const passwordMatched = await compare(password, ownerData.password);

               if (!passwordMatched) return res.clearCookie(AUTH_COOKIE_NAME).errorResponse(StatusCodes.BAD_REQUEST, "Wrong password.");

               AuthService.createTokenAndSendAuthCookie(ownerData, res);
          } catch (error) {
               console.log(error);
               next(error);
          }
     },

     async oauth(req, res, next) {
          try {
               const { code, provider } = req.body;

               if (!code || !provider) return res.sendStatus(StatusCodes.BAD_REQUEST);

               let name = null,
                    email = null,
                    picture = null;

               switch (provider) {
                    case "google": {
                         let accessToken = null;
                         // get access token and refresh token from code
                         const response1 = await Axios.post("https://oauth2.googleapis.com/token", {
                              client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
                              client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
                              redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
                              grant_type: "authorization_code",
                              code
                         });

                         accessToken = response1.data.access_token;

                         // get user info
                         const response2 = await Axios.get("https://www.googleapis.com/oauth2/v1/userinfo", {
                              headers: { Authorization: `Bearer ${accessToken}` }
                         });

                         name = response2.data.name;
                         email = response2.data.email;
                         picture = response2.data.picture;

                         break;
                    }
                    default: {
                         console.log("unknown oauth came");
                         return res.errorResponse(StatusCodes.BAD_REQUEST, "Unsupported Oauth Provider");
                    }
               }

               req.body.name = name;
               req.body.email = email;
               req.body.picture = picture;

               // check if user exists, if exists then log them in or register their account
               let ownerData = await UserModel.findOne({ email });

               // user not found, create their account
               if (!ownerData) {
                    const { email, name, picture } = req.body;
                    ownerData = await UserModel.create({ email, name, picture });
               }

               AuthService.createTokenAndSendAuthCookie(ownerData, res);
          } catch (error) {
               console.log(error);
               next(error);
          }
     },

     async forgotPassword(req, res, next) {
          try {
               const { email } = req.body;

               // find the user using email
               const ownerData = await UserModel.findOne({ email, "status.active": true });

               if (!ownerData) return res.apiResponse(StatusCodes.OK, "Email sent.");

               // create a random token
               const token = Utils.createRandomStringToken();

               // insert a record in password reset collection
               await ResetPasswordModel.create({
                    owner_id: ownerData._id,
                    token,
                    expires_at: moment().add(15, "minutes").toDate()
               });

               await mail.sendPasswordResetEmail({ to: { username: ownerData.name, email }, resetToken: token });

               return res.apiResponse(StatusCodes.OK, "Email sent.");
          } catch (error) {
               console.log(error.message);
               next(error);
          }
     },

     async resetPasswordTokenCheck(req, res, next) {
          try {
               return res.apiResponse(StatusCodes.OK);
          } catch (error) {
               console.log(error);
               next(error);
          }
     },

     async resetPassword(req, res, next) {
          try {
               const { password, reset_id } = req.body;

               // mark the reset id as used
               const resetId = await ResetPasswordModel.findOneAndUpdate({ token: reset_id }, { $set: { used: true } });

               // hash and update password
               const hasedPassword = await hash(password, 10);

               await UserModel.findByIdAndUpdate(resetId.owner_id, {
                    $set: { password: hasedPassword, auth: { method: CONSTANTS.AUTH_METHODS.PASSWORD, provider: CONSTANTS.AUTH_PROVIDERS.APP } }
               });

               return res.apiResponse(StatusCodes.OK);
          } catch (error) {
               console.log(error);
               next(error);
          }
     },

     async userData(req, res, next) {
          try {
               const userData = await UserModel.findById(req.user._id);

               if (!userData) return res.clearCookie(AUTH_COOKIE_NAME).errorResponse(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED);

               return res.apiResponse(StatusCodes.OK, "User data fetched successfully.", userData);
          } catch (error) {
               console.log(error);
               next(error);
          }
     },

     async logout(req, res, next) {
          return res
               .clearCookie(AUTH_COOKIE_NAME, {
                    path: "/",
                    httpOnly: true,
                    sameSite: "strict",
                    domain: CLIENT.domain
               })
               .apiResponse(StatusCodes.OK, "Logged out.");
     }
};

export default AuthController;
