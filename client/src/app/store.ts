import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import userSlice from "../features/userSlice"
import employeesSlice from "../features/employeesSlice"
import employeeDetailSlice from "../features/employeeDetailSlice"
import employeeTodoSlice from "../features/employeeTodoSlice"
import chatWithBosSlice from "../features/chatWithBosSlice"
import employeeItemTodoSlice from "../features/employeeItemTodoSlice"


export const store = configureStore({
    reducer: {userSlice, employeesSlice, employeeDetailSlice, employeeTodoSlice, chatWithBosSlice, employeeItemTodoSlice}
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
