import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import transactionService from "./transactionService";
import { extractErrorMessage } from "../../../utils";

const initialState = {
  transactions: null,
  transaction: null,
  dashboard: null,
};


// get all users transactions
export const getTransactions = createAsyncThunk(
  "transactions/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.access_token
      return await transactionService.getTransactions(token);
    } catch (error) {
        return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
);

export const createTransaction = createAsyncThunk(
  "transactions/create",
  async (transactionData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.access_token
      return await transactionService.createTransaction(token, transactionData);
    } catch (error) {
        return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
);


export const patchTransactions = createAsyncThunk(
  "transactions/partial-edit",
  async ({transaction_id, newData}, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.access_token
      return await transactionService.patchTransactions(token, transaction_id, newData);
    } catch (error) {
        return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
);

// get dashboard data
export const getDashboard = createAsyncThunk(
  "transactions/getDashboard",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.access_token
      return await transactionService.getDashboard(token);
    } catch (error) {
        return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
);

function updateObjectInArray(array, updatedObject) {
  // Use the Array.prototype.map to create a new array with the updated object
  const updatedArray = array.map(obj => {
      // Check if the current object has the specified ID
      if (obj.id === updatedObject.id) {
          // If yes, update the object with the new values
          return updatedObject ;
      } else {
          // If no, return the original object
          return obj;
      }
  });

  return updatedArray;
}


export const transactionSlice = createSlice({
  name: "transaction",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
    // get transactions
      .addCase(getTransactions.pending, (state) => {
        state.transactions = null
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload
      })
      //create transactions
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.transactions.results.unshift(action.payload)
      })
      // partial edit transaction
      .addCase(patchTransactions.fulfilled, (state, action) => {
        state.transactions.results = updateObjectInArray(state.transactions.results, action.payload)
        state.transaction = action.payload
      })

      //dashboard
      .addCase(getDashboard.pending, (state) => {
        state.dashboard = null
      })
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.dashboard = action.payload
      })
  },
});

export const { reset } = transactionSlice.actions;
export default transactionSlice.reducer;
