import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import chatService from "./chatService";
import { extractErrorMessage } from "../../../utils";


// get budget
export const getMessages = createAsyncThunk(
  "messages/all",
  async (room, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.access_token
      return await chatService.getMessages(token, room);
    } catch (error) {
        return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
);



export const createMessage = createAsyncThunk(
  "message/create",
  async ({room, message}, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.access_token
      return await chatService.createMessage(token, room, message);
    } catch (error) {
        return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
);

export const createRoom = createAsyncThunk(
  "room/create",
  async (room, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.access_token
      return await chatService.createRoom(token, room);
    } catch (error) {
        return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
);

export const chatSlice = createSlice({
  name: "chat",
  initialState: { messages: [], loading: false, room: []},
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMessages.pending, (state) => {
        state.loading = true

      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })

      .addCase(createMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      })

      .addCase(createRoom.fulfilled, (state, action) => {
        state.room = action.payload
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.room = action.payload
      })
  },
});

export const { reset } = chatSlice.actions;
export default chatSlice.reducer;