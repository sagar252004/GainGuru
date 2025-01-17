import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import SellForm from './SellForm';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { setLoading,  setWalletBalance } from '@/redux/authSlice'
import axios from "axios";
import toast from 'react-hot-toast';
import { STOCK_API_END_POINT } from '../utils/constant';

export default function Holdings({ portfolio, onBuyMore }) {

  const [isSellingStock, setIsSellingStock] = useState(null);
  const dispatch = useDispatch();


  const handleSellClickedStock = (stock) => {
    setIsSellingStock(stock);
  };

  const handleClose = () => {
    setIsSellingStock(null);
  };

  const { user } = useSelector((store) => store.auth);

  const handleSellSubmit = async (quantity, sellPrice) => {
    //console.log(`"Selling ${quantity} shares of ${isSellingStock.name} at $${sellPrice} each`);
    
    if (!isSellingStock) {
      toast.error('No stock selected');
      return;
    }

    try {
      dispatch(setLoading(true));

      const sellData = {
        quantity,
        stockTicker : isSellingStock.stock.ticker,
        currentPrice : isSellingStock.mkt_price,
      }
      
      // Sending request to backend
      const res = await axios.post(
        `${STOCK_API_END_POINT}/sell/${user._id}`,
        // `https://gainguru-lsr2.onrender.com/api/v1/stocks/sell/${user._id}`,
        sellData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res?.data?.success) {
        toast.success(res.data.message);

        dispatch(setWalletBalance(res.data.walletBalance));
        setIsSellingStock(null);
      } else {
        toast.error(res?.data?.error || 'Failed to sell shares');
      }
    } catch (error) {
      toast.error( error.response?.data?.error || 'Failed to sell shares');
      console.error('Error during stock purchase:', error);
      const errorMessage = error.response?.data?.error || 'Something went wrong';
    } finally {
      dispatch(setLoading(false));
    }
  };

  const totalInvested = portfolio.reduce((sum, stock) => 
    sum + (stock.invested || 0),0
  );

  const currentValue = portfolio.reduce((sum, stock) => 
    sum + (stock.current || 0), 0
  );
  
  const totalReturns = currentValue - totalInvested;
  const returnsPercentage = totalInvested ? ((currentValue - totalInvested) / totalInvested) * 100 : 0;

  return (
    <div className="p-6">
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-600">Total Invested</h3>
            <DollarSign className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold">${totalInvested.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-600">Current Value</h3>
            <DollarSign className="text-green-500" />
          </div>
          <p className="text-2xl font-bold">${currentValue.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-600">Total Returns</h3>
            {totalReturns >= 0 ? (
              <TrendingUp className="text-green-500" />
            ) : (
              <TrendingDown className="text-red-500" />
            )}
          </div>
          <p className={`text-2xl font-bold ${totalReturns >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${totalReturns.toFixed(2)} ({returnsPercentage.toFixed(2)}%)
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full text-sm md:text-base">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Stock
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Shares
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Buy Price
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Current Price
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Returns
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {portfolio.map((stock) => (
          <tr
            key={stock._id}
            className="hover:bg-gray-50 transition-colors duration-200"
          >
            <td className="px-6 py-4">
              <div>
                <div className="font-medium text-gray-900">
                  {stock.stock.name}
                </div>
                <div className="text-sm text-gray-500">{stock.stock.ticker}</div>
              </div>
            </td>
            <td className="px-6 py-4">{stock.shares}</td>
            <td className="px-6 py-4">${stock.avg_price}</td>
            <td className="px-6 py-4">${stock.mkt_price}</td>
            <td className="px-6 py-4">
              <span
                className={
                  stock.returns && stock.returns >= 0
                    ? 'text-green-500 font-medium'
                    : 'text-red-500 font-medium'
                }
              >
                ${stock.returns?.toFixed(2)} (
                {stock.returnsPercentage?.toFixed(2)}%)
              </span>
            </td>
            <td className="px-6 py-4 flex space-x-2">
              <button
                onClick={() => onBuyMore(stock)}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 rounded-lg transition duration-200"
              >
                Buy
              </button>
              <button
                onClick={() => handleSellClickedStock(stock)}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 rounded-lg transition duration-200"
              >
                Sell
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
        {isSellingStock && (
        <SellForm
          stock={isSellingStock}
          onSubmit={handleSellSubmit}
          onClose={handleClose}
        />
      )}
      </div>

  );
}
