import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice';
import chatReducer from '../features/chats/chatSlice';

const store = configureStore({
  reducer: {
    // accounts: accountReducer,
    auth: authReducer,
    // chat: chatReducer,
  },
});

export default store;

