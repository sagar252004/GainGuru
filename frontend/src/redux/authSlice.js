import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    
    name:"auth",

    initialState:{
        loading:false,
        user:null,
        walletBalance : 0,
    },

    reducers:{
        // actions
        setLoading:(state, action) => {
            state.loading = action.payload;
        },
        setUser:(state, action) => {
            state.user = action.payload;
        },
        setWalletBalance:(state, action) => {
            state.walletBalance = action.payload;
        },

    }
});

export const {setLoading, setUser,setWalletBalance} = authSlice.actions;
export default authSlice.reducer;