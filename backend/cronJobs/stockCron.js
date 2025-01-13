import cron from 'node-cron';
import fetch from 'node-fetch';
import { fetchStockData } from '../controllers/stock.controller.js';

cron.schedule('30 16 * * 1-5', async () => {
    console.log("Fetching stock data at 11:30 AM ET...");
    //await fetchStockData();
});

cron.schedule('30 20 * * 1-5', async () => {
    console.log("Fetching stock data at 3:30 PM ET...");
    //await fetchStockData();
});

cron.schedule('04 17 * * 1-5', async () => {
    console.log("Fetching stock data at 22:34 IST...");
    //await fetchStockData();
});

cron.schedule('05 17 * * 1-5', async () => {
    console.log("Fetching stock data at 22:35 IST...");
    //await fetchStockData();
});



// First job: Runs every minute
cron.schedule('* * * * *', async () => {
    //console.log("Fetching stock data...");
    //await fetchStockData();
});


