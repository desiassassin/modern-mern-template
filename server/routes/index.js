import { Router } from "express";
import authRouter from "./auth.js";

const router = Router();

router.use("/auth", authRouter);

router.get("/health-check", function (req, res) {
     return res.sendStatus(200);
});

export default router;
