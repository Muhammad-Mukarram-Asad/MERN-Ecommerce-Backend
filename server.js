import express from 'express';
import connecToDB from './configDB/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import authRouter from './routes/auth/authRoutes.js';
import adminProductsRouter from './routes/admin/productsRoutes.js'
import shopProductsRouter from './routes/shop/productRoutes.js'
import shopCartRouter from './routes/shop/cartRoutes.js'
import commonFeatureRouter from './routes/common/featureRoute.js'
dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Expires', 'Pragma'],
}));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/carts", shopCartRouter);
app.use("/api/common/feature", commonFeatureRouter);
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Server is running perfectly :)")
})

connecToDB();
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})

