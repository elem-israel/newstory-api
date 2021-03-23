import express from "express";
import { postReport, randomPost } from "../../cotrollers/post";
import image from "./image";

const router = express.Router();

router.use("/image", image);
router.post("/random", randomPost);
router.post("/:post/report", postReport);

export default router;
