import React, { useState } from 'react';
import { Wallet, ChevronDown, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux'

import { setLoading, setUser } from '@/redux/authSlice'
import { setOwnedStocks, setAvailableStocks} from '../redux/stocksSlice'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

export default function UserProfile({ onAddFunds, onWithdraw, userEmail }) {
  
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [showFundsModal, setShowFundsModal] = useState(false);
  const [transactionType, setTransactionType] = useState('add');

  const walletBalance = useSelector((state) => state.auth.walletBalance);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async (e) => {
    e.preventDefault();
    try {
        dispatch(setLoading(true));
        const res = await axios.post('http://localhost:5000/api/v1/user/logout',{
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true,

        });

        if (res.data.success) {
            dispatch(setUser(null));
            dispatch(setAvailableStocks([]));
            dispatch(setOwnedStocks([]));
            navigate("/")
            //navigate("/home", { state: { user: res.data.user } });
            toast.success(res.data.message);
        }

    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
    } finally {
        dispatch(setLoading(false));
    }
  };

  const handleTransaction = (e) => {
      e.preventDefault();
      const value = parseFloat(amount);
      if (transactionType === 'add') {
        onAddFunds(value);
      } else{
        onWithdraw(value);
      }
      setAmount('');
      setShowFundsModal(false);
  };

  const openModal = (type) => {
      setTransactionType(type);
      setShowFundsModal(true);
  };

  return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
        >
          <div className="flex items-center">
            <Wallet className="h-5 w-5 mr-2" />
            <span className="font-medium">${walletBalance?.toFixed(2) || -1000}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 z-20 bg-white rounded-md shadow-lg py-1">
            <div className="px-4 py-2 text-sm text-gray-700 border-b">
              {userEmail}
            </div>
            <button
              onClick={() => openModal('add')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Add Funds
            </button>
            <button
              onClick={() => openModal('withdraw')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Withdraw Funds
            </button>
            <hr className="my-1" />
            <button
              onClick={logoutHandler}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <div className="flex items-center">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </div>
            </button>
          </div>
        )}

        {showFundsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                {transactionType === 'add' ? 'Add Funds' : 'Withdraw Funds'}
              </h2>
              <form onSubmit={handleTransaction}>
                <div className="mb-4 ">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFundsModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
  );

}