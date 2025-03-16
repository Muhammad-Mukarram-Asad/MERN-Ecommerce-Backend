import express from "express";
import { addFeatureImage, getFeatureImages } from "../../controllers/common/featureController.js";
const router = express.Router();

router.post("/add", addFeatureImage);
router.get("/get", getFeatureImages);

export default router