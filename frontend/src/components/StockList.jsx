import React from 'react';
import { Search } from 'lucide-react';

export default function StockList({ stocks, onBuy, searchQuery, onSearchChange }) {
  return (
    <div className="p-6">
      <div className="mb-6 relative">
        <div className="relative  z-10">
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stocks.map((stock) => (
          <div key={stock.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{stock.name}</h3>
                <p className="text-gray-600">{stock.ticker}</p>
              </div>
              <span className="text-lg font-bold text-blue-600">${stock.avg_price}</span>
            </div>
            <button
              onClick={() => onBuy(stock)}
              className="w-full mt-2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Buy Stock
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}