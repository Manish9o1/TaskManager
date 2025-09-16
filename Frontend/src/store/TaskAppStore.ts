import { configureStore } from "@reduxjs/toolkit";
import { TaskManagerApis } from "../api/TaskManagerApis";
import { LoginAuthSlice } from "../feature/login/LoginAuthSlice";
import { useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    [TaskManagerApis.reducerPath]: TaskManagerApis.reducer,
    AppAuth: LoginAuthSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(TaskManagerApis.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
