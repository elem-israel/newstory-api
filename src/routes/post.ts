import express from "express";
import { randomPost } from "../cotrollers/post";

const router = express.Router();

router.post("/random", randomPost);  

export default router;
