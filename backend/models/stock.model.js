import mongoose from 'mongoose';

// Stock model - static information about the stock
const stockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ticker: { type: String, required: true, unique: true },
});

export const Stock = mongoose.model('Stock', stockSchema);