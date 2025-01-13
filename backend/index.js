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

dotenv.config({});

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;


// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


const corsOptions = {
    origin: 'http://localhost:5173', // Allow only your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    credentials: true, // If you need to send cookies or authorization headers
};

// Apply the CORS middleware with your options
app.use(cors(corsOptions));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/stocks", stockRoute);


const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    connectDB();
    console.log(`server running at port ${PORT}`);
})


app.get("/getStocks", async (req, res) => {
    // Array of stock symbols with their corresponding names
    const stockDetails = [
        { ticker: 'AAPL', name: 'Apple Inc.' },
        // { ticker: 'MSFT', name: 'Microsoft Corporation' },
        // { ticker: 'GOOGL', name: 'Alphabet Inc. (Google)' },
        // { ticker: 'AMZN', name: 'Amazon.com, Inc.' },
        // { ticker: 'TSLA', name: 'Tesla, Inc.' }
    ];

    try {
        const responses = await Promise.all(stockDetails.map(async (stock) => {
            const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock.ticker}&apikey=${process.env.API_KEY}`);
            
            // Handle the case where the API returns an error response
            if (!response.ok) {
                throw new Error(`Error fetching data for ${stock.ticker}: ${response.statusText}`);
            }

            const data = await response.json();

            // Check if the API response contains the expected "Time Series (Daily)" field
            const timeSeries = data['Time Series (Daily)'];
            if (!timeSeries) {
                console.error(`No data for ${stock.ticker}`);
                return { ticker: stock.ticker, name: stock.name, error: "No data available" };
            }

            // Get the most recent completed day
            const dates = Object.keys(timeSeries);
            const previousDay = dates[0]; // Dates are in descending order
            const details = timeSeries[previousDay];

            // Return the desired fields
            return {
                ticker: stock.ticker,
                name: stock.name,
                date: previousDay,
                open: details['1. open'],
                high: details['2. high'],
                low: details['3. low'],
                close: details['4. close'],
                volume: details['5. volume']
            };
        }));

        // Send the enriched stock data as a response
        res.json(responses);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to fetch stock data" });
    }
});

