import express from "express";
import { postReport } from "../../../cotrollers/image";
import { randomImage } from "../../../cotrollers/image";
import { validateSchema } from "../../../middleware/joi";
import imageReport from "../../../schemas/imageReport";

const router = express.Router();

router.post("/random", randomImage);
router.post("/:image/report", validateSchema(imageReport), postReport);

export default router;
