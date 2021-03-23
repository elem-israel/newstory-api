import express from "express";
import { validateSchema } from "./../middleware/joi";
import { randomPost, postReport, randomImage } from "../cotrollers/demo";
import imageReport from "../schemas/imageReport";

const router = express.Router();

router.post("/post/random", randomPost);
router.post("/post/:post/report", postReport);
router.post("/post/image/random", randomImage);
router.post(
  "/post/image/:image/report",
  validateSchema(imageReport),
  postReport
);

export default router;
