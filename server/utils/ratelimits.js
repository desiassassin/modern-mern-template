import rateLimit from "express-rate-limit";

export const registerLimiter = rateLimit({
     windowMs: 5 * 60 * 1000, // 5 minutes
     max: 30,
     standardHeaders: true,
     legacyHeaders: false,
     message: { message: "Too many accounts created from this IP." }
});

export const loginLimiter = rateLimit({
     windowMs: 5 * 60 * 1000, // 5 minute
     max: 10,
     standardHeaders: true,
     legacyHeaders: false,
     message: { message: "Too many login attempts." }
});

export const forgotPasswordLimiter = rateLimit({
     windowMs: 30 * 60 * 1000, // 30 minutes
     max: 3,
     standardHeaders: true,
     legacyHeaders: false,
     message: { message: "Too many password reset requests." }
});

export const dashboardLimiter = rateLimit({
     windowMs: 60 * 1000, // 60 seconds
     max: 200, // 200 requests per user
     standardHeaders: true,
     legacyHeaders: false,
     message: {
          message: "Too many requests."
     },
     keyGenerator: (req, res) => {
          return req.user?._id || req.ip; // fallback to IP if user is missing
     }
});
