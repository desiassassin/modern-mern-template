import mongoose from "mongoose";

mongoose.Schema.Types.Boolean.convertToFalse.add("No");
mongoose.Schema.Types.Boolean.convertToTrue.add("Yes");

const userSchema = new mongoose.Schema(
     {
          name: String,
          email: String,
          password: String,
          phone: {
               country_code: String,
               number: String
          },
          picture: String,
          status: {
               active: {
                    type: Boolean,
                    default: true
               },
               reason: {
                    type: String,
                    default: ""
               }
          },
          auth: {
               method: String,
               provider: String
          }
     },
     { timestamps: true, minimize: false }
);

const User = mongoose.model("User", userSchema);

userSchema.index({ email: 1 });

export default User;
