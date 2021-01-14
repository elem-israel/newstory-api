import express from "express";
import post from "./post";
import auth from "./auth";

const router = express.Router();

router.use("/post", post);
router.use("/auth", auth);

export default router;