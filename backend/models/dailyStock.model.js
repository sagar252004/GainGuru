import mongoose from 'mongoose';

// Define the DailyStock schema
const dailyStockSchema = new mongoose.Schema({
    ticker: { type: String, required: true },
    name: { type: String, required: true },
    date: { type: String, required: true },
    open: { type: String, required: true },
    high: { type: String, required: true },
    low: { type: String, required: true },
    close: { type: String, required: true },
    volume: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now } 
});

export const DailyStock = mongoose.model('DailyStock', dailyStockSchema);


