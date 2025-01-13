import { createSlice } from "@reduxjs/toolkit";

const stocksSlice = createSlice({
  name: "stocks",
  initialState: {
    availableStocks: [],
    ownedStocks: [],
    error: null,
    loading: false,
  },
  reducers: {
    setAvailableStocks: (state, action) => {
      state.availableStocks = action.payload;
    },
    setOwnedStocks: (state, action) => {
      state.ownedStocks = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setAvailableStocks, setOwnedStocks, setError, setLoading } = stocksSlice.actions;
export default stocksSlice.reducer;
