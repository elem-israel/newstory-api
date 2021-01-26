import express from "express";
import { randomPost, postReport } from "../cotrollers/demo";

const router = express.Router();

router.post("/post/random", randomPost);
router.post("/post/:post/report", postReport);  

export default router;
