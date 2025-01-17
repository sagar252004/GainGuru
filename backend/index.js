import express from "express";
const app = express();

import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import stockRoute from "./routes/stock.route.js";
import fetch from "node-fetch";
import './cronJobs/stockCron.js';
import { fetchStockData } from "./utils/data.js";

dotenv.config({});

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;


// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


const corsOptions = {
    origin:   'https://gain-guru-seven.vercel.app/',
     // Allow only your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    credentials: true, // If you need to send cookies or authorization headers
};

// Apply the CORS middleware with your options
app.use(cors(corsOptions));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/stocks", stockRoute);

const fetchStockDataOnStart = async () => {
    console.log("Fetching stock data as the backend starts...");
    const result = await fetchStockData();
};

const PORT = process.env.PORT ;
app.listen(PORT,()=>{
    connectDB();
    console.log(`server running at port ${PORT}`);
    fetchStockDataOnStart();
})


