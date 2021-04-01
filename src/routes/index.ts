import express from "express";
import post from "./post";
import auth from "./auth";
import demo from "./demo";

const router = express.Router();

router.use("/demo", demo);
router.use("/post", post);
router.use("/auth", auth);

export default router;
