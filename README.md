

#GainGuru

GainGuru is a real-time stock trading platform that allows users to buy, sell, and track their stock portfolio. The app provides features such as real-time stock price fetching, a wallet system for adding or withdrawing money, and a profit/loss tracker. GainGuru fetches stock data from the Ventage API, which is limited to 25 API calls per day, so data is fetched twice a day using scheduled tasks.

## Project Overview

*GainGuru* is designed to offer a seamless and user-friendly platform for stock trading. It allows users to view live stock prices, make stock trades, and track their profits and losses. The app also includes a wallet system where users can deposit or withdraw money to manage their trades.

## Key Features

- 📈 *Real-time Stock Prices*: Fetches stock prices using the Ventage API.
- 💰 *Buy/Sell Stocks*: Users can buy and sell stocks in real-time.
- 📊 *Profit/Loss Tracker*: Displays the current status of profits and losses from trades.
- 💳 *Wallet System*: A wallet system that allows users to add or withdraw money.
- 🕑 *Scheduled Data Fetching*: Stock data is fetched twice a day using a scheduled task to respect the API call limit.
- 🔒 *User Authentication*: Secure login and registration system for users.

## Technologies Used
- *Backend*:
    - *Node.js*: The backend of the application, handling all server-side logic and task scheduling.
    - *Express.js*: Web framework for Node.js to handle HTTP requests and API endpoints.
    - *node-cron*: Used for scheduling repetitive tasks like fetching stock data at specified intervals.
    - *node-fetch*: For making HTTP requests to fetch stock data from the Ventage API.
    - *JavaScript*: The core programming language for implementing the business logic and functionality.

- *Frontend*:  
    - *React*: JavaScript library for building user interfaces.
    - *Tailwind CSS*: A utility-first CSS framework for styling the user interface.

- *Authentication*:  
  - *JWT (JSON Web Token)*: For securing the user authentication and authorization system.


### Getting Started


1. clone the repository:
   bash
    git clone https://github.com/sagar252004/GainGuru
   
   
2. Navigate to the project directory:
   bash(2)
    cd backend
    cd frontend
   

3. Set up environment variables :
   bash
    MONGO_URI=paste your mongo uri
    PORT= enter your port number
    SECRET_KEY= enter your secret key
    ALPHA_VANTAGE_API_KEY=paste your aplha vantage api key 
   
  
4.  Install dependencies:
   bash
       npm install
   
   
5. Start the development server:
   bash
     backend: npm run dev
     frontend: npm run 
