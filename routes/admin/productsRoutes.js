import express from "express";
import { handleImageUploadToCloudinary, fetchAllProducts, addNewProduct, editProduct, deleteProduct } from "../../controllers/admin/productsController.js";
import { upload } from "../../utils/cloudinary.js"

const router = express.Router();

router.post("/upload-image", upload.single("myFile") , handleImageUploadToCloudinary);
router.post("/add", addNewProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/fetchAllProducts", fetchAllProducts);

export default router;