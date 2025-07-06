import * as Yup from "yup";
import { UserModel, ResetPasswordModel } from "../model/index.js";

const AuthValidtions = {
     registerPassword: Yup.object({
          name: Yup.string().min(3, "Name is too short").max(50, "Name is too long").required("Name is required"),
          email: Yup.string()
               .email("Invalid email address")
               .required("Email is required")
               .test("checkEmailExists", "Email already in use", async (email) => {
                    // check if user exists, if exists then give error
                    const userExists = await UserModel.exists({ email });
                    return !userExists;
               }),
          password: Yup.string().min(8, "Password must be at least 8 characters").max(50, "Password is too long").required("Password is required")
     }),

     loginPassword: Yup.object({
          email: Yup.string().email("Invalid email address").required("Email is required"),
          password: Yup.string().required("Password is required")
     }),

     forgotPassword: Yup.object({
          email: Yup.string().email("Invalid email address").required("Email is required")
     }),

     resetPasswordTokenCheck: Yup.object({
          reset_id: Yup.string()
               .required("Reset ID is required")
               .test("checkTokenIsValid", "Reset ID has expired or already been used.", async (reset_id) => {
                    // check if token exists and is not used
                    const validToken = await ResetPasswordModel.exists({ token: reset_id, used: false, expires_at: { $gt: new Date() } });
                    return !!validToken;
               })
     }),

     resetPassword: Yup.object({
          reset_id: Yup.string()
               .required("Reset ID is required")
               .test("checkTokenIsValid", "Reset ID has expired or already been used.", async (reset_id) => {
                    // check if token exists and is not used
                    const validToken = await ResetPasswordModel.exists({ token: reset_id, used: false, expires_at: { $gt: new Date() } });
                    return !!validToken;
               }),
          password: Yup.string().min(8, "Password must be at least 8 characters").max(50, "Password is too long").required("Password is required"),
          confirm_password: Yup.string()
               .required("Please confirm your password")
               .oneOf([Yup.ref("password"), null], "Passwords must match")
     })
};

export default AuthValidtions;
