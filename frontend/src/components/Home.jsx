import React, { useEffect, useState } from 'react';
import StockList from './StockList';
import toast from 'react-hot-toast';
import Holdings from './Holdings';
import StockForm from './StockForm';
import UserProfile from './UserProfile';
import { useNavigate } from 'react-router-dom';
import useGetStocks from '../hooks/useGetStocks';
import { useDispatch, useSelector } from 'react-redux'
import {  setWalletBalance } from '@/redux/authSlice'
import { setLoading,setOwnedStocks} from '../redux/stocksSlice'
import { TrendingUp } from 'lucide-react';
import axios from 'axios';
import { STOCK_API_END_POINT, USER_API_END_POINT } from '../utils/constant';

function Home() {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useGetStocks();

  const { user } = useSelector((store) => store.auth);
  if(user === undefined) {
    navigate('/');
  }

  const [view, setView] = useState('home');
  const [portfolio, setPortfolio] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const availableStocks = useSelector((state) => state.stocks.availableStocks);
  const ownedStocks = useSelector((state) => state.stocks.ownedStocks);
  const walletBalance = useSelector((state) => state.stocks.walletBalance);

  useEffect(()=>{
    setPortfolio(ownedStocks);
  },[ownedStocks]);

  // Filter stocks based on search query
  const filterStocks = () => {
    if (!availableStocks || availableStocks.length === 0) {
      return []; // Return an empty array if stocks are not defined or empty
    }

    return availableStocks.filter(
      (stock) =>
        stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.ticker.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleBuy = (stock) => {
    setSelectedStock(stock);
  };

  const handleBuyMore = (stock) => {
    setSelectedStock({
      ...stock.stock,
      avg_price : stock.avg_price
    });
  };

  const handleBuySubmit = async (shares) => {
    if (!selectedStock) {
      toast.error('No stock selected');
      return;
    }

    const totalCost = shares * selectedStock.avg_price;

    if (totalCost > walletBalance) {
      toast.error('Insufficient funds in wallet');
      return;
    }

    const totalValue = shares * selectedStock.avg_price;
    const returns = totalValue - totalCost;
    const returnsPercentage = (returns / totalCost) * 100;

    const inputStock = {
      name: selectedStock.name,
      ticker: selectedStock.ticker, // Assuming ticker is same as name here; adjust if needed
      shares,
      avg_price: selectedStock.avg_price,
      mkt_price: selectedStock.avg_price,
    };

    try {
      dispatch(setLoading(true));

      // Sending request to backend
      const res = await axios.post(
        `${STOCK_API_END_POINT}/add/${user._id}`,
        // `https://gainguru-lsr2.onrender.com/api/v1/stocks/add/${user._id}`, // Ensure `user` contains a valid ID
        inputStock,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );


      if (res?.data?.success) {
        toast.success(res.data.message);
        dispatch(setWalletBalance(res.data.walletBalance));
        setSelectedStock(null);
        dispatch(setOwnedStocks([]))
      } else {
        toast.error(res?.data?.message || 'Failed to add stock');
      }
    } catch (error) {
      console.error('Error during stock purchase:', error);
      const errorMessage = error.response?.data?.error || 'Something went wrong';
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
    
  };

  const handleAddFunds = async (amount) => {
    if (amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    try {
          dispatch(setLoading(true));

          // Sending request to backend
          const res = await axios.post(
            `${USER_API_END_POINT}/add`,
            // 'https://gainguru-lsr2.onrender.com/api/v1/user/add',
            {
              userId : user._id, amountToAdd : amount
            },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );

          if (res?.data?.success) {
            toast.success(res.data.message);
            dispatch(setWalletBalance(res.data.walletBalance));
            setSelectedStock(null);
          } 
          else{
            toast.error(res?.data?.error || 'Failed to add stock');
          }
    } 
    catch (error) {
      console.error('Error during stock purchase:', error);
      const errorMessage = error.response?.data?.error || 'Something went wrong';
      toast.error(errorMessage);
    } 
    finally {
      dispatch(setLoading(false));
    }

  };

  const handleWithdraw  = async (amount) => {
    if (amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    try {
          dispatch(setLoading(true));
          // Sending request to backend
          const res = await axios.post(
            `${USER_API_END_POINT}/withdraw`,
            // 'https://gainguru-lsr2.onrender.com/api/v1/user/withdraw',
            {
              userId : user._id, amountToWithdraw : amount
            },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );

          if (res?.data?.success) {
            toast.success(res.data.message);
            dispatch(setWalletBalance(res.data.walletBalance));
            setSelectedStock(null);
          } 
          else {
            toast.error(res?.data?.error || 'Failed to add stock');
          }
    } 
    catch (error) {
      console.error('Error during stock purchase:', error);
      const errorMessage = error.response?.data?.error || 'Something went wrong';
      toast.error(errorMessage);
    } 
    finally {
      dispatch(setLoading(false));
    }

  };

 

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
            <TrendingUp className="h-10 w-10 font-bold text-blue-600 mr-2" />
            <button
  onClick={() => setView('home')}
  className="flex items-center space-x-2 px-4 py-2 bg-transparent"
>
  <span className="text-xl font-bold text-gray-900">GainGuru</span>
</button>

              <div className="ml-8">
                <button
                  onClick={() => setView('home')}
                  className={`inline-flex items-center px-4 py-2 border-b-2 ${
                    view === 'home' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500'
                  }`}
                >
                  Explore
                </button>
                <button
                  onClick={() => setView('Holdings')}
                  className={`inline-flex items-center px-4 py-2 border-b-2 ${
                    view === 'Holdings' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500'
                  }`}
                >
                  Holdings
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <UserProfile
                walletBalance={walletBalance}
                onAddFunds={handleAddFunds}
                onWithdraw={handleWithdraw}
                userEmail={user?.email}
              />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {view === 'home' ? (
          <StockList
            stocks={filterStocks()}
            onBuy={handleBuy}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        ) : (
          <Holdings portfolio={portfolio}  onBuyMore={handleBuyMore} />
        )}

        {selectedStock && (
          <StockForm stock={selectedStock} onSubmit={handleBuySubmit} onClose={() => setSelectedStock(null)} />
        )}
      </main>
    </div>
  );

}

export default Home;
