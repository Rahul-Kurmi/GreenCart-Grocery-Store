import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './configs/db.js';

import express from 'express';
const app = express();

import 'dotenv/config'; 
/* EQUIVALENT TO
import dotenv from 'dotenv';
dotenv.config();
*/

import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';

const port = process.env.PORT || 4000 ;
await connectDB(); 

// connect cloudinary to store images
await connectCloudinary();

// URL of Frontend that is allowed to access our Backend 
const allowedOrigins = ['http://localhost:5173' , 'https://grocery-green-cart.vercel.app'];

app.post('/stripe' , express.raw({type : 'application/json'}), stripeWebhooks);

// Middleware configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin : allowedOrigins , credentials : true}));

app.get('/' , (req, res)=>{
    res.send("API is working");
});

app.use('/api/user' , userRouter);
app.use('/api/seller' , sellerRouter);
app.use('/api/product' , productRouter);
app.use('/api/cart' , cartRouter);
app.use('/api/address' , addressRouter);
app.use('/api/order' , orderRouter);

app.listen(port , () => {
    console.log(`Server is running on http://localhost:${port}`);
})

