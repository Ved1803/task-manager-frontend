import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base API URL
const API_URL = "http://localhost:3001";

// Async Thunk for Login
export const loginUser = createAsyncThunk("auth/loginUser", async (user, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/login`,{user});
    
    localStorage.setItem("token", response.data.status.token); // Store token
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async Thunk for Signup
export const signupUser = createAsyncThunk("auth/signupUser", async (user, { rejectWithValue }) => {
  try {
   const response = await axios.post(`${API_URL}/signup`, {
        user
    } );
    console.log(response.data, 'signup page data')
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async Thunk for Logout
export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { rejectWithValue }) => {
  console.log("Inside logoutUser function..."); // Debugging step
  try {
    const token = localStorage.getItem("token");
    console.log("Token from storage:", token);

    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.delete("http://localhost:3001/logout", {
      headers: {
        Authorization: `Bearer ${token}`, // Ensure correct format
      },
    });

    console.log("Logout successful:", response.data);
    localStorage.removeItem("token");
    return true;
  } catch (error) {
    console.error("Logout failed:", error);
    return rejectWithValue(error.response?.data || error.message);
  }
});


// Authentication Slice
const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: localStorage.getItem("token") || null, error: null, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; })
      .addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.token = action.payload.token; })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(signupUser.pending, (state) => { state.loading = true; })
      .addCase(signupUser.fulfilled, (state) => { state.loading = false; })
      .addCase(signupUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(logoutUser.fulfilled, (state) => { state.user = null; state.token = null; });
  },
});

export default authSlice.reducer;
