import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import { setAvailableStocks, setOwnedStocks, setError, setLoading } from '../redux/stocksSlice';

const useGetStocks = () => {
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoadingState] = useState(true);
  const [error, setErrorState] = useState(null);
  const dispatch = useDispatch();

  const fetchAllStocks = async () => {
          try {
                setLoadingState(true);
                const res = await axios.get(`https://gainguru-lsr2.onrender.com/api/v1/stocks/user/${user._id}`, { withCredentials: true });
            
                if (res?.data?.availableStocks && res?.data?.ownedStocks) {
                  dispatch(setAvailableStocks(res.data.availableStocks));
                  dispatch(setOwnedStocks(res.data.ownedStocks));
                } else {
                  setErrorState('Stocks data is missing in the response');
                  dispatch(setError('Stocks data is missing'));
                }
          }
          catch (error) {
                  setErrorState("Failed to fetch stocks");
                  dispatch(setError("Failed to fetch stocks"));
                  console.error('Fetch error:', error);
          }
          finally{
                  setLoadingState(false);
                  dispatch(setLoading(false));
          }
  };

  useEffect(() => {
    fetchAllStocks(); // Initial fetch when the component mounts

    const interval = setInterval(() => {
      fetchAllStocks(); 
    }, 1000); 

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [dispatch]); // Empty dependency array means this useEffect runs on mount and whenever dispatch changes
  
};

export default useGetStocks;
