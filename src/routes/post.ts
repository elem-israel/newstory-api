import express from "express";
import { postReport, randomPost } from "../cotrollers/post";

const router = express.Router();

router.post("/random", randomPost);
router.post("/:post/report", postReport);

export default router;
