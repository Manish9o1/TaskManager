import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../shared/model";

interface AuthState {
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

export const LoginAuthSlice = createSlice({
  name: "LoginAuthSlice",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setCredentials, logout } = LoginAuthSlice.actions;
