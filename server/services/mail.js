import Axios from "axios";
import * as CONSTANTS from "../constants.js";

async function sendPasswordResetEmail({ to, resetToken }) {
     const passwordResetLink = `${CONSTANTS.BASE_URL[process.env.NODE_ENV].CLIENT}/reset-password?reset_id=${resetToken}`;

     console.log(`[${new Date().toISOString()}] Sending a password reset email to ${to.email}`);

     await sendEmail({
          recipients: [
               {
                    to: [{ name: to.username, email: to.email }],
                    variables: { username: to.username, password_reset_link: passwordResetLink }
               }
          ],
          from: {
               name: "Username", // username to be shown in the email
               email: "alias@yourdomain.in" // email alias like alias@yourdomain.in
          },
          domain: CONSTANTS.EMAIL_DOMAIN,
          template_id: CONSTANTS.MSG91.EMAIL.PASSWORD_RESET.TEMPLATE_ID
     });
}

async function sendEmail(payload) {
     try {
          await Axios.post(CONSTANTS.MSG91.EMAIL.ENDPOINT, JSON.stringify(payload), {
               headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                    authKey: process.env.MSG91_AUTH_KEY
               }
          });

          console.log(`[${new Date().toISOString()}] Email sent successfully.`);
     } catch (error) {
          console.log(error.message);
          throw new Error("Error sending email. Please try again later.");
     }
}

export default {
     sendPasswordResetEmail
};
