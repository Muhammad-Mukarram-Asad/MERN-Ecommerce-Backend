import { addToCart, fetchAllCartItems, updateCartItems, deleteCartItem } from "../../controllers/shop/cartsController.js";
import express from "express";

const router = express.Router();

router.post("/addToCart", addToCart);
router.get("/fetchAllCartItems/:userId", fetchAllCartItems);
router.put("/updateCartItem", updateCartItems);
router.delete("/deleteCartItem/:userId/:productId", deleteCartItem);

export default router