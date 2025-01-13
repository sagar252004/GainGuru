// Original array
const stocks = [
  {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "date": "2025-01-10",
      "open": "240.0100",
      "high": "240.1600",
      "low": "233.0000",
      "close": "236.8500",
      "volume": "61710856"
  },
  {
      "symbol": "MSFT",
      "name": "Microsoft Corporation",
      "date": "2025-01-10",
      "open": "424.6300",
      "high": "424.7100",
      "low": "415.0200",
      "close": "418.9500",
      "volume": "20201132"
  },
  {
      "symbol": "GOOGL",
      "name": "Alphabet Inc. (Google)",
      "date": "2025-01-10",
      "open": "194.2950",
      "high": "196.5200",
      "low": "190.3100",
      "close": "192.0400",
      "volume": "26665206"
  },
  {
      "symbol": "AMZN",
      "name": "Amazon.com, Inc.",
      "date": "2025-01-10",
      "open": "221.4600",
      "high": "221.7100",
      "low": "216.5000",
      "close": "218.9400",
      "volume": "36811525"
  },
  {
      "symbol": "TSLA",
      "name": "Tesla, Inc.",
      "date": "2025-01-10",
      "open": "391.4000",
      "high": "399.2800",
      "low": "377.2900",
      "close": "394.7400",
      "volume": "61495260"
  }
];

// Function to generate a random price between low and high
const getRandomPrice = (low, high) => {
  return (Math.random() * (high - low) + low).toFixed(2); // Random price between low and high
};

// Function to transform the array with random prices between low and high
const transformStocks = (stocks) => {
  return stocks.map((stock, index) => ({
      id: (index + 1).toString(), // Generate a sequential ID
      name: stock.name,          // Use the existing name
      ticker: stock.symbol,      // Map symbol to ticker
      price: getRandomPrice(parseFloat(stock.low), parseFloat(stock.high)) // Random price between low and high
  }));
};

// Immediately export transformed stocks
export const availableStocks = transformStocks(stocks);
