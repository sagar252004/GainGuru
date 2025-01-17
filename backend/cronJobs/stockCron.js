import cron from 'node-cron';
import fetch from 'node-fetch';
import  {fetchStockData}  from '../utils/data.js';

// 1. Pre-market opens (8:00 AM ET) -> 6:30 PM IST
cron.schedule('30 18 * * *', async () => {
    console.log("Fetching stock data at 6:30 PM IST (Pre-market Open)...");
    await fetchStockData();
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});

// 2. Market opens (9:30 AM ET) -> 7:00 PM IST
cron.schedule('0 19 * * *', async () => {
    console.log("Fetching stock data at 7:00 PM IST (Market Open)...");
    await fetchStockData();
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});

// 3. Mid-day (12:00 PM ET) -> 10:30 PM IST
cron.schedule('30 22 * * *', async () => {
    console.log("Fetching stock data at 10:30 PM IST (Mid-day)...");
    await fetchStockData();
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});

// 4. Market closes (4:00 PM ET) -> 2:30 AM IST (next day)
cron.schedule('30 2 * * *', async () => {
    console.log("Fetching stock data at 2:30 AM IST (Market Close)...");
    await fetchStockData();
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});

// 5. 10:30 AM IST (additional time)
cron.schedule('30 10 * * *', async () => {
    console.log("Fetching stock data at 10:30 AM IST...");
    await fetchStockData();
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});

// First job: Runs every minute
// cron.schedule('* * * * *', async () => {
//     //console.log("Fetching stock data...");
//     //await fetchStockData();
// });


