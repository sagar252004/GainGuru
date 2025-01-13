import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant.js'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser, setWalletBalance } from '@/redux/authSlice'
import { Mail, Lock, User } from 'react-feather'; 

const Signup = () => {

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        password: "",
    });

    const {loading, user} = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            dispatch(setLoading(true));
            
            // Send the input as JSON
            const res = await axios.post(`${USER_API_END_POINT}/register`, input, {
                headers: { 'Content-Type': 'application/json' }, // Changed content type to JSON
                withCredentials: true,
            });

            if (res.data.success) {
              dispatch(setUser(res.data.user));
              dispatch(setWalletBalance(res.data.user.walletBalance));
              navigate("/home");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'An error occurred');
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
          navigate('/home');
        }
    }, [user, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Account</h2>
        
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={input.fullname}
                name="fullname"
                onChange={changeEventHandler}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Account
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-gray-600">Already have an account? </span>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
