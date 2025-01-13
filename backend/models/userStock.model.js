import mongoose from 'mongoose';
import { User} from './user.model.js'
import {Stock}  from './stock.model.js';


// UserStock model - dynamic, user-specific stock information
const userStockSchema = new mongoose.Schema({
  stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true }, // Reference to the Stock model
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who owns the stock
  shares: { type: Number, required: true }, // Number of shares
  avg_price: { type: Number, required: true }, // Average price of shares
  mkt_price: { type: Number, required: true }, // Current market price of the stock
  current: { type: Number }, // Current value of the shares (shares * mkt_price)
  invested: { type: Number }, // Total invested value (shares * avg_price)
  returns: { type: Number }, // Returns (current - invested)
  returnsPercentage: { type: Number }, // Returns percentage ((returns / invested) * 100)
});

export const UserStock = mongoose.model('UserStock', userStockSchema);
