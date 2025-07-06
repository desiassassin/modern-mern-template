import mongoose from "mongoose";

const resetPasswordSchema = new mongoose.Schema(
     {
          owner_id: {
               type: mongoose.Types.ObjectId,
               ref: "Owner"
          },
          token: String,
          expires_at: Date,
          used: {
               type: Boolean,
               default: false
          }
     },
     { minimize: false, timestamps: true }
);

resetPasswordSchema.index({ owner_id: 1 });

const resetPasswordModel = mongoose.model("reset_password", resetPasswordSchema);

export default resetPasswordModel;
