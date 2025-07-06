import dotenv from "dotenv";
dotenv.config();

export const AUTH_COOKIE_NAME = "authorization";

export const LENGTH_LIMIT = {
     REFERRAL_CODE: 6,
     OTP: 4
};

export const EXPIRY = {
     RESEND_OTP_AFTER_TIME: 30 * 1000, // 30 sec,
     OTP_EXPIRE_TIME: 2 * 60 * 1000, // 2 min
     TOKEN_EXPIRE_TIME: 1 * 30 * 24 * 60 * 60, // 1 month in seconds - months x days x hours x minutes x seconds
     TOKEN_COOKIE_EXPIRE_TIME: 1 * 30 * 24 * 60 * 60 * 1000, // 1 month in mililseconds - months x days x hours x minutes x seconds * miliseconds
     WRONG_OTP: 3, // 3 times user can put wrong otp
     EXPIRY_ATTEMPT_COUNT: 3,
     RESET_PASSWORD_EXPIRE_TIME: 60 * 60 * 1000 // 60 minutes
};

export const STATUS = {
     INACTIVE: 0,
     ACTIVE: 1,
     BLOCKED: 2
};

export const AUTH_METHODS = {
     OAUTH: "OAUTH",
     PASSWORD: "PASSWORD"
};

export const AUTH_PROVIDERS = {
     GOOGLE: "GOOGLE",
     APP: "APP"
};

export const DEFAULT = {
     OTP: "1234",
     LANGUAGE: "en",
     LIMIT: 20,
     PAGE: 1,
     SEARCH_LIMIT: 5
};

// delay sending the response by some time
export const DELAY_RESPONSE = {
     enabled: false, // [!] CAUTION [!] DO NOT COMMIT WITH THE VALUE BEING `TRUE`
     miliseconds: 2000,
     seconds: 2 * 1000
};

export const MSG91 = {
     EMAIL: {
          ENDPOINT: "https://control.msg91.com/api/v5/email/send",
          PASSWORD_RESET: {
               TEMPLATE_ID: "reset_password_template_id"
          }
     }
};

export const BASE_URL = {
     development: {
          CLIENT: `http://localhost:3000`,
          SERVER: `http://localhost:3001`
     },
     production: {
          CLIENT: `https://${process.env.DOMAIN}`,
          SERVER: `https://api.${process.env.DOMAIN}`
     }
};

export const DOMAIN = process.env.DOMAIN;
export const EMAIL_DOMAIN = `mail.${process.env.DOMAIN}`;
