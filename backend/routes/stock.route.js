import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";  // Ensure the path is correct
import { addStock, sellStocks, getStocks, fetchStockData } from "../controllers/stock.controller.js";  // Ensure the path is correct

const router = express.Router();

// Get stocks for a specific user
router.route("/user/:userId").get(getStocks);

// Add stock to user's portfolio
router.route("/add/:userId").post(isAuthenticated, addStock);

// Sell stock from user's portfolio
router.route("/sell/:userId").post(isAuthenticated, sellStocks);

// Fetch stock data
router.route('/stocks/fetch').get(fetchStockData);

export default router;
