import {TTodo} from "../utils/type";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {ICreateTodoEmployeeReq, IGetTodoEmployeeRes} from "../utils/interface";
import queryString from "query-string";

interface IInitialState {
    todo: TTodo[],
    totalPage: number
    loading: boolean
}

const initialState: IInitialState = {
    todo: [],
    totalPage: 1,
    loading: false
}

export const getTodosByEmployee = createAsyncThunk<IGetTodoEmployeeRes, any>(
    "employeeTodoSlice/getTodosByEmployee",
    async (data, thunkAPI: any) => {
        const {employeeId, ...searchParams} = data
        const queryStringParams = queryString.stringify(searchParams);

        try {
            const response = await axios(`/api/employee-todo/${employeeId}${"?" + queryStringParams}`, {
                headers: {
                    authorization: `Bearer ${thunkAPI.getState().userSlice.token}`
                }
            })

            return {
                todos: response.data.todos,
                status: response.status,
                totalPage: response.data.totalPage
            }

        } catch (err) {
            return thunkAPI.rejectWithValue(err)
        }
    }
)


export const createTodoByEmployee = createAsyncThunk<any, ICreateTodoEmployeeReq>(
    "employeeTodoSlice/createTodoByEmployee",
    async (data, thunkAPI: any) => {
        try {
            const response = await axios.post(`/api/employee-todo/create/${data.employeeId}`, data, {
                headers: {
                    authorization: `Bearer ${thunkAPI.getState().userSlice.token}`
                }
            })
            if (response.status === 201) {
                thunkAPI.dispatch(addNewTodoByFront(response.data.todo))
            }
            return {
                status: response.status,
                todo: response.data.todo
            }
        } catch (err) {
            return thunkAPI.rejectWithValue(err)
        }
    }
)

const employeeTodoSlice = createSlice({
    name: "employeeTodoSlice",
    initialState,
    reducers: {
        addNewTodoByFront: (state, action) => {
            state.todo.push(action.payload)
        },
        changeTodoStatus: (state, action: PayloadAction<string>) => {
            const findTodo = state.todo.find(todo => todo.id === action.payload)

            if (findTodo) {
                findTodo.complete = !findTodo.complete
            }

        }
    },
    extraReducers: (builder) => {
        builder
            /*GET TODOS EMPLOYEE*/
            .addCase(getTodosByEmployee.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTodosByEmployee.fulfilled, (state, action: PayloadAction<IGetTodoEmployeeRes>) => {
                state.loading = false;
                state.todo = action.payload.todos;
                state.totalPage = action.payload.totalPage;
            })
            .addCase(getTodosByEmployee.rejected, (state) => {
                state.loading = false;
            })
            /*CREATE TODOS EMPLOYEE*/
            .addCase(createTodoByEmployee.pending, (state) => {
                state.loading = true;
            })
            .addCase(createTodoByEmployee.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createTodoByEmployee.rejected, (state) => {
                state.loading = false;
            })
    }
})

export const {addNewTodoByFront, changeTodoStatus} = employeeTodoSlice.actions;
export default employeeTodoSlice.reducer;

