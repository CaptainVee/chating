import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";
import { extractErrorMessage } from "../../../utils";

// get user from local storage
const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user ? user : null, //set user to user if it exisit else set to null
  isLoading: false,
  users: []
};

// register user
export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    try {
      return await authService.register(user);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Login user
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error) {
    console.log(error)
    return thunkAPI.rejectWithValue(extractErrorMessage(error));
  }
});

// Logout user
export const logout = createAsyncThunk("auth/logout", async () => {
  authService.logout();
});

// Activate user
export const activate = createAsyncThunk(
  "auth/activate",
  async (user, thunkAPI) => {
    try {
      return await authService.activate(user);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// get all users 
export const getUsers = createAsyncThunk(
  "user/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.access
      console.log(" token", token)
      return await authService.getUsers(token);
    } catch (error) {
        console.log(" erre", error)
        return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state) => {
        state.isLoading = false;
      })
      //   login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
      })
      //   logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      //   activate
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload
      })
  },
});

export const {reset} = authSlice.actions
export default authSlice.reducer
