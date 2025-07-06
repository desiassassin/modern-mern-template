import { Router } from "express";
import authController from "../controller/auth.js";
import { validateToken } from "../middlewares/auth.js";
import authValidations from "../validators/auth.js";
import validateRequest from "../middlewares/validation.js";
import * as rateLimiters from "../utils/ratelimits.js";

const authRouter = Router();

// register and login
authRouter.post("/register-pw", validateRequest(authValidations.registerPassword), rateLimiters.registerLimiter, authController.registerPassword);
authRouter.post("/login-pw", validateRequest(authValidations.loginPassword), rateLimiters.loginLimiter, authController.loginPassword);
authRouter.post("/oauth", authController.oauth);

// reset password
authRouter.post(
     "/forgot-password",
     validateRequest(authValidations.forgotPassword),
     rateLimiters.forgotPasswordLimiter,
     authController.forgotPassword
);
authRouter.get("/validate-reset-token", validateRequest(authValidations.resetPasswordTokenCheck), authController.resetPasswordTokenCheck);
authRouter.post("/reset-password", validateRequest(authValidations.resetPassword), authController.resetPassword);

authRouter.get("/user-data", validateToken, rateLimiters.dashboardLimiter, authController.userData);
authRouter.get("/logout", authController.logout);

export default authRouter;
