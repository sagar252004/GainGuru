import React, { useState } from 'react';

export default function SellForm({ stock, onSubmit, onClose }) {
    
  const [quantity, setQuantity] = useState(1);
  const [sellPrice, setSellPrice] = useState(stock.avg_price);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(quantity, sellPrice);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Sell {stock.stock.name} ({stock.stock.ticker})</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
            />
          </div>
          {/* <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Sell Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={sellPrice}
              onChange={(e) => setSellPrice(Number(e.target.value))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
            />
          </div> */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Confirm Sell
            </button>
          </div>
        </form>
        
      </div>
    </div>
  );
}
