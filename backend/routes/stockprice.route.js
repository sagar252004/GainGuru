import express from "express";
import { getStockPrice } from "../controllers/stockprice.controller.js";
const router = express.Router();

router.get('/:symbol',getStockPrice);

export default router;
