import React, { useState } from 'react';

export default function StockForm({ stock, onSubmit, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [buyPrice, setBuyPrice] = useState(stock.avg_price);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(quantity, buyPrice);
  };

  return (
    <div className="fixed inset-0 bg-black  bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Buy {stock.name} ({stock.ticker})</h2>
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
              className="w-full p-2 z-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Buy Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={buyPrice}
              onChange={(e) => setBuyPrice(Number(e.target.value))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
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
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Confirm Purchase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}