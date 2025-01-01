import express from "express";
import {registerUser, loginUser, logoutUser, authMiddleware}  from "../../controllers/auth/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", authMiddleware, (req, res) => {
    const user = req.user;
    res.status(200).json({message: "Authenticated User", user});
})

export default router