import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {TTodo} from "../utils/type";


interface IInitialState {
    todo: TTodo | null
    loading: boolean
}


const initialState: IInitialState = {
    todo: null,
    loading: false
}

export const getTodoItemByEmployee = createAsyncThunk(
    "employeeItemTodoSlice/getTodoByEmployee",
    async (todoId: string, thunkAPI: any) => {
        try {
            const response = await axios(`/api/employee-todo/employee-todo-get-todo/${todoId}`, {
                headers: {
                    authorization: `Bearer ${thunkAPI.getState().userSlice.token}`
                }
            });

            return {
                status: response.status,
                todo: response.data.todo
            }

        } catch (err) {
            thunkAPI.rejectWithValue(err)
        }
    }
);

export const changeTodoComplete = createAsyncThunk(
    "employeeItemTodoSlice/changeTodoComplete",
    async (todoId: string, thunkAPI:any) => {
        try {
            const response = await axios.patch(`/api/employee-todo/change-complete-todo/${todoId}`, "", {
                headers: {
                    authorization: `Bearer ${thunkAPI.getState().userSlice.token}`
                }
            });

            return {
                status: response.status,
                todo: response.data.todo
            }
        } catch (err) {
            thunkAPI.rejectWithValue(err);
        }
    }
)

const employeeItemTodoSlice = createSlice({
    name: "employeeItemTodoSlice",
    initialState,
    reducers: {
        changeTodoStatusDetailItem: (state, action:PayloadAction<string>) => {
          if(state.todo && state.todo.id === action.payload) {
              state.todo.complete = !state.todo.complete
          }
        },
        clearTodo: (state) => {
            state.todo = null
        }
    },
    extraReducers: builder => {
        builder
            /*GET TODO INFO DETAIL*/
            .addCase(getTodoItemByEmployee.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTodoItemByEmployee.fulfilled, (state, action: any) => {
                state.loading = false;
                state.todo = action.payload.todo

            })
            .addCase(getTodoItemByEmployee.rejected, (state) => {
                state.loading = false;
            })

        /*CHANGE TODO COMPLETE*/
            .addCase(changeTodoComplete.pending, (state) => {})
            .addCase(changeTodoComplete.fulfilled, (state, action: any) => {
                state.todo = action.payload.todo
            })
            .addCase(changeTodoComplete.rejected, (state) => {})
    }

})

export const {clearTodo, changeTodoStatusDetailItem} = employeeItemTodoSlice.actions;

export default employeeItemTodoSlice.reducer;
