import {DailyStock} from '../models/dailyStock.model.js';
import connectDB from './db.js';



const stockDetails = [{
    "ticker": "AAPL",
    "name": "Apple Inc.",
    "date": "2025-01-14",
    "open": "234.7500",
    "high": "236.1200",
    "low": "232.4720",
    "close": "233.2800",
    "volume": "39435294"
},
{
    "ticker": "MSFT",
    "name": "Microsoft Corporation",
    "date": "2025-01-14",
    "open": "417.8100",
    "high": "419.7400",
    "low": "410.7200",
    "close": "415.6700",
    "volume": "16935856"
},
{
    "ticker": "GOOGL",
    "name": "Alphabet Inc. (Google)",
    "date": "2025-01-14",
    "open": "191.2400",
    "high": "191.9800",
    "low": "188.3082",
    "close": "189.6600",
    "volume": "17174854"
},
{
    "ticker": "AMZN",
    "name": "Amazon.com, Inc.",
    "date": "2025-01-14",
    "open": "220.4400",
    "high": "221.8200",
    "low": "216.2000",
    "close": "217.7600",
    "volume": "24711650"
},
{
    "ticker": "TSLA",
    "name": "Tesla, Inc.",
    "date": "2025-01-14",
    "open": "414.3400",
    "high": "422.6400",
    "low": "394.5400",
    "close": "396.3600",
    "volume": "83216061"
},
{
    "ticker": "NFLX",
    "name": "Netflix, Inc.",
    "date": "2025-01-14",
    "open": "843.2000",
    "high": "844.8925",
    "low": "823.5190",
    "close": "828.4000",
    "volume": "3037650"
},
{
    "ticker": "META",
    "name": "Meta Platforms, Inc.",
    "date": "2025-01-14",
    "open": "605.0650",
    "high": "605.4900",
    "low": "588.5500",
    "close": "594.2500",
    "volume": "13597992"
},
{
    "ticker": "NVDA",
    "name": "NVIDIA Corporation",
    "date": "2025-01-14",
    "open": "136.0500",
    "high": "136.3800",
    "low": "130.0500",
    "close": "131.7600",
    "volume": "195590485"
},
{
    "ticker": "BRK-B",
    "name": "Berkshire Hathaway Inc.",
    "date": "2025-01-14",
    "open": "445.5000",
    "high": "450.3000",
    "low": "443.9200",
    "close": "450.0300",
    "volume": "4055602"
},
{
    "ticker": "JPM",
    "name": "JPMorgan Chase & Co.",
    "date": "2025-01-14",
    "open": "242.6600",
    "high": "247.7200",
    "low": "242.1900",
    "close": "247.4700",
    "volume": "12407386"
},
{
    "ticker": "V",
    "name": "Visa Inc.",
    "date": "2025-01-14",
    "open": "308.7500",
    "high": "310.1600",
    "low": "307.5200",
    "close": "309.0900",
    "volume": "5107901"
},
{
    "ticker": "DIS",
    "name": "The Walt Disney Company",
    "date": "2025-01-14",
    "open": "108.6800",
    "high": "108.9600",
    "low": "107.6100",
    "close": "108.1200",
    "volume": "5501600"
},
{
    "ticker": "PEP",
    "name": "PepsiCo, Inc.",
    "date": "2025-01-14",
    "open": "144.1900",
    "high": "145.1400",
    "low": "143.5600",
    "close": "144.9500",
    "volume": "6996448"
},
{
    "ticker": "KO",
    "name": "The Coca-Cola Company",
    "date": "2025-01-14",
    "open": "61.6550",
    "high": "62.0650",
    "low": "61.3000",
    "close": "62.0400",
    "volume": "16658287"
},
{
    "ticker": "XOM",
    "name": "Exxon Mobil Corporation",
    "date": "2025-01-14",
    "open": "108.7900",
    "high": "109.7600",
    "low": "107.8300",
    "close": "109.7200",
    "volume": "11191175"
}
]
// const uniqueStocks = Array.from(new Map(stockDetails.map(stock => [stock.ticker, stock])).values());

//console.log(uniqueStocks);

/*
try {
  connectDB();
  const deletedStocks = await DailyStock.deleteMany({});
  // console.log(deletedStocks);
  const insertedStocks = await DailyStock.insertMany(stockDetails);
  console.log("inserted",insertedStocks);
} catch (error) {
  
}
*/

export const fetchStockData = async () => {
  try {
    await Promise.all(
      stockDetails.map(async (stock) => {
        try {
          const response = await fetch(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock.ticker}&apikey=${process.env.API_KEY}`
          );

          if (!response.ok) {
            console.error(`Error fetching data for ${stock.ticker}: ${response.statusText}`);
            return; // Skip this stock if there's an error with the API
          }

          const data = await response.json();

          // Check if the response contains an "Information" field (rate limit message)
          if (data.Information) {
            // console.warn(`Rate limit reached for ${stock.ticker}: ${data.Information}`);
            return; // Skip this stock
          }

          const timeSeries = data['Time Series (Daily)'];

          if (!timeSeries) {
            console.error(`No data available for ${stock.ticker}`);
            return; // Skip this stock if no data is available from the API
          }

          const dates = Object.keys(timeSeries);
          const previousDay = dates[0]; // Latest trading day
          const details = timeSeries[previousDay];

          // Proceed with upserting the stock data only if fetching was successful
          await DailyStock.findOneAndUpdate(
            { ticker: stock.ticker, date: previousDay },
            {
              ticker: stock.ticker,
              name: stock.name,
              date: previousDay,
              open: details['1. open'],
              high: details['2. high'],
              low: details['3. low'],
              close: details['4. close'],
              volume: details['5. volume'],
              lastUpdated: new Date(),
            },
            { upsert: true, new: true }
          );

          console.log(`Stock data for ${stock.ticker} updated successfully.`);
        } catch (err) {
          console.error(`Error processing stock ${stock.ticker}:`, err);
          // Skip this stock if there's an error during processing
        }
      })
    );

    // Respond with a success message after processing all stocks
    console.log("Stock data processed successfully");
  } catch (error) {
    console.log("An unexpected error occurred while processing stock data");
  }
};