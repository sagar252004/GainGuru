import fetch from 'node-fetch';

import  {Stock}  from '../models/stock.model.js';
import  {UserStock}  from '../models/userStock.model.js';
import  {User}  from '../models/user.model.js';
import {DailyStock} from '../models/dailyStock.model.js';

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;


export const addStock = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, ticker, shares, avg_price, mkt_price } = req.body;

    // Validate that numeric fields are numbers
    if (isNaN(shares) || isNaN(avg_price) || isNaN(mkt_price)) {
      return res.status(400).json({ success: false, error: 'Invalid numeric data' });
    }

    // Convert input to numbers
    const sharesNum = parseFloat(shares);
    const avgPriceNum = parseFloat(avg_price);
    const mktPriceNum = parseFloat(mkt_price);

    // Calculate the total cost of the stock purchase
    const totalCost = sharesNum * avgPriceNum;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Check if the user has enough wallet balance
    if (user.walletBalance < totalCost) {
      return res.status(400).json({ success: false, error: 'Insufficient wallet balance to buy the stock.' });
    }

    // Deduct the total cost from the user's wallet
    user.walletBalance -= totalCost;

    // Check if stock with the same ticker exists in the Stock model
    let stock = await Stock.findOne({ ticker });

    if (!stock) {
      // If the stock doesn't exist, create a new Stock document
      stock = await Stock.create({
        name,
        ticker,
      });
    }

    // Check if the user already has this stock in their portfolio
    let userStock = await UserStock.findOne({ stock: stock._id, user: userId });

    if (userStock) {
      // Update existing UserStock entry
      const newShares = userStock.shares + sharesNum;
      const newInvested = userStock.invested + totalCost;
      const newAvgPrice = newInvested / newShares;
      const newCurrent = newShares * mktPriceNum;
      const newReturns = newCurrent - newInvested;
      const newReturnsPercentage = (newReturns / newInvested) * 100;

      userStock.shares = parseFloat(newShares.toFixed(2));
      userStock.avg_price = parseFloat(newAvgPrice.toFixed(2));
      userStock.invested = parseFloat(newInvested.toFixed(2));
      userStock.current = parseFloat(newCurrent.toFixed(2));
      userStock.returns = parseFloat(newReturns.toFixed(2));
      userStock.returnsPercentage = parseFloat(newReturnsPercentage.toFixed(2));
      userStock.mkt_price = parseFloat(mktPriceNum.toFixed(2));

      await userStock.save();

      // Save the user's updated wallet balance
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Stock updated successfully and wallet balance deducted.',
        walletBalance: user.walletBalance,
      });
    }

    // If UserStock entry doesn't exist, create a new one
    userStock = await UserStock.create({
      stock: stock._id,
      user: userId,
      shares: parseFloat(sharesNum.toFixed(2)),
      avg_price: parseFloat(avgPriceNum.toFixed(2)),
      mkt_price: parseFloat(mktPriceNum.toFixed(2)),
      current: parseFloat((sharesNum * mktPriceNum).toFixed(2)),
      invested: parseFloat(totalCost.toFixed(2)),
      returns: parseFloat(((sharesNum * mktPriceNum) - totalCost).toFixed(2)),
      returnsPercentage: parseFloat((((sharesNum * mktPriceNum - totalCost) / totalCost) * 100).toFixed(2)),
    });

    // Add the stock to the user's portfolio
    user.stocks = user.stocks || [];
    user.stocks.push(userStock._id);

    // Save the user's updated wallet balance and portfolio
    await user.save();
  
    res.status(201).json({
      success: true,
      message: 'Stock added successfully and wallet balance deducted.',
      walletBalance: user.walletBalance,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: error.message });
  }
};

export const sellStocks = async (req, res) => {
  try {
    const { userId } = req.params;
    const { quantity, stockTicker, currentPrice } = req.body;

    // Validate numeric input
    const quantityNum = parseFloat(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid quantity provided' });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Find the stock
    const stock = await Stock.findOne({ ticker: stockTicker });
    if (!stock) {
      return res.status(404).json({ success: false, error: 'Stock not found' });
    }

    // Find the user's stock entry
    const userStock = await UserStock.findOne({ stock: stock._id, user: userId });
    if (!userStock) {
      return res.status(404).json({ success: false, error: "You don't own this stock" });
    }

    // Check if the user has enough shares to sell
    if (userStock.shares < quantityNum) {
      return res.status(400).json({
        success: false,
        error: "Insufficient stocks: You don't have enough shares to complete this sale.",
      });
    }

    // Calculate the sale amount
    const saleAmount = quantityNum * currentPrice;
    //console.log("parseFloat((user.walletBalance + saleAmount).toFixed(2))",parseFloat((user.walletBalance + saleAmount).toFixed(2)) );

    // Calculate the remaining shares and update details
    const remainingShares = userStock.shares - quantityNum;
    const invested = userStock.invested - quantityNum * userStock.avg_price;
    const current = remainingShares * userStock.mkt_price;
    const returns = current - invested;

    let returnsPercentage = 0;
    if (invested !== 0) {
      returnsPercentage = (returns / invested) * 100;
    }

    // If all shares are sold, delete the UserStock entry
    if (remainingShares <= 0) {
      await UserStock.deleteOne({ _id: userStock._id });

      // Remove the stock reference from the user's portfolio
      user.stocks = user.stocks.filter((stockId) => stockId.toString() !== userStock._id.toString());
      
      // Add sale amount to user's wallet
      user.walletBalance = parseFloat((user.walletBalance + saleAmount).toFixed(2));
      await user.save();

      return res.status(200).json({ success: true, message: 'All shares sold successfully', walletBalance: user.walletBalance });
    }

    // Update the UserStock entry with new values
    userStock.shares = parseFloat(remainingShares.toFixed(2));
    userStock.invested = parseFloat(invested.toFixed(2));
    userStock.current = parseFloat(current.toFixed(2));
    userStock.returns = parseFloat(returns.toFixed(2));
    userStock.returnsPercentage = parseFloat(returnsPercentage.toFixed(2));

    await userStock.save();
    // Add sale amount to user's wallet
    user.walletBalance = parseFloat((user.walletBalance + saleAmount).toFixed(2));
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Shares sold successfully',
      walletBalance: user.walletBalance,
    });

  } catch (error) {
    console.error('Error in sellStocks Controller:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};



export const fetchStockData = async (req, res) => {
  // Updated stock details to only include AAPL and MSFT
  const stockDetails = [
    { ticker: 'AAPL', name: 'Apple Inc.' },
    { ticker: 'MSFT', name: 'Microsoft Corporation' },
    { ticker: 'GOOGL', name: 'Alphabet Inc. (Google)' },
    { ticker: 'AMZN', name: 'Amazon.com, Inc.' },
    { ticker: 'TSLA', name: 'Tesla, Inc.' }
  ];

  try {
    const responses = await Promise.all(stockDetails.map(async (stock) => {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock.ticker}&apikey=${process.env.API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`Error fetching data for ${stock.ticker}: ${response.statusText}`);
        }

        const data = await response.json();
        const timeSeries = data['Time Series (Daily)'];

        if (!timeSeries) {
          console.error(`No data for ${stock.ticker}`);
          return { ticker: stock.ticker, name: stock.name, error: "No data available" };
        }

        const dates = Object.keys(timeSeries);
        const previousDay = dates[0]; // Latest trading day
        const details = timeSeries[previousDay];

        // Upsert (insert or update) stock data in the database
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
            lastUpdated: new Date()
          },
          { upsert: true, new: true }
        );

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

      } catch (err) {
        console.error(`Error processing ${stock.ticker}:`, err);
        return { ticker: stock.ticker, name: stock.name, error: err.message };
      }
    }));

    res.json({ success: true, data: responses });
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({ success: false, error: "Failed to fetch stock data" });
  }
};


export const getStocks = async (req, res) => {

  const getRandomPrice = (low, high) => (Math.random() * (high - low) + low).toFixed(2);

  const transformStocks = (stocks) => {
    return stocks.map((stock, index) => ({
      id: (index + 1).toString(),
      name: stock.name,
      ticker: stock.ticker.toUpperCase(),
      avg_price: getRandomPrice(parseFloat(stock.low), parseFloat(stock.high)),
    }));
  };

  const updateOwnedStocks = (ownedStocks, availableStocks) => {

    
    const stockMap = new Map(
      availableStocks.map((stock) => [stock.ticker, stock])
    );
    
  
    

    return ownedStocks.map((ownedStock) => {
      const ownedTicker = ownedStock?.stock?.ticker?.toUpperCase();
      const currentStock = stockMap.get(ownedTicker);

      if (currentStock) {
        const mktPrice = parseFloat(currentStock.avg_price).toFixed(2);
        const currentValue = (mktPrice * ownedStock.shares).toFixed(2);
        const returns = (currentValue - ownedStock.invested).toFixed(2);
        const returnsPercentage = ((returns / ownedStock.invested) * 100).toFixed(2);

        ownedStock.set({
          mkt_price: mktPrice,
          current: currentValue,
          returns,
          returnsPercentage,
        });
      } else {
        console.log(`Stock ${ownedTicker} not found in available stocks`);
      }

      return ownedStock;
    });
  };

  try {
    const { userId } = req.params;
     // const stocks = await fetchStockData();
    // Mock stock data
    const stocks = [
      {
        ticker: "AAPL",
        name: "Apple Inc.",
        date: "2025-01-10",
        open: "240.0100",
        high: "240.1600",
        low: "233.0000",
        close: "236.8500",
        volume: "61710856",
      },
      {
        ticker: "MSFT",
        name: "Microsoft Corporation",
        date: "2025-01-10",
        open: "424.6300",
        high: "424.7100",
        low: "415.0200",
        close: "418.9500",
        volume: "20201132",
      },
      {
        ticker: "GOOGL",
        name: "Alphabet Inc. (Google)",
        date: "2025-01-10",
        open: "194.2950",
        high: "196.5200",
        low: "190.3100",
        close: "192.0400",
        volume: "26665206",
      },
      {
        ticker: "AMZN",
        name: "Amazon.com, Inc.",
        date: "2025-01-10",
        open: "221.4600",
        high: "221.7100",
        low: "216.5000",
        close: "218.9400",
        volume: "36811525",
      },
      {
        ticker: "TSLA",
        name: "Tesla, Inc.",
        date: "2025-01-10",
        open: "391.4000",
        high: "399.2800",
        low: "377.2900",
        close: "394.7400",
        volume: "62287333",
      },
    ];



    // Transform the stock data to include average prices
    const availableStocks = transformStocks(stocks);

    // Fetch the user and their owned stocks
    const user = await User.findById(userId).populate({
      path: "stocks", // Populate the `stocks` field in `User`
      populate: {
        path: "stock", 
        model: "Stock",
      },
    });

    if (!user) {
      console.log(`User with ID ${userId} not found.`);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update owned stocks with current market data
    user.stocks = updateOwnedStocks(user.stocks, availableStocks);

    // Save the updated user data
    await user.save();


    const ownedStocks = user.stocks.sort((a, b) => b.returnsPercentage - a.returnsPercentage);


    return res.status(200).json({
      success: true,
      availableStocks,
      ownedStocks
    });
  } catch (error) {
    console.error("Error fetching and updating stocks:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch and update stocks" });
  }
};






















