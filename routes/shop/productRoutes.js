import {getFilteredProducts, getProductDetails} from "../../controllers/shop/productsController.js";
import express from "express";

const router = express.Router();

router.get("/getFilteredProducts", getFilteredProducts);
router.get("/getProductDetails/:id", getProductDetails);

export default router