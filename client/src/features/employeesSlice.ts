import {TEmployees} from "../utils/type";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {ICreateEmployeeFrom, IEmployeesDataRes} from "../utils/interface";
import queryString from "query-string";

interface IEmployeesSlice {
    employees: TEmployees[];
    loading: boolean;
    totalPage: number
}

const initialState: IEmployeesSlice = {
    employees: [],
    loading: false,
    totalPage: 0
}


export const getEmployeesByUser = createAsyncThunk<IEmployeesDataRes, {
    pageItems: string,
    currentPage: string,
    searchEmployeesValue: string,
    statusSearch: string
}>(
    "employeesSlice/getEmployeesByUser",
    async (data, thunkAPI: any) => {
        try {
            const queryStringParams = queryString.stringify(data);
            const response = await axios(`/api/employee${"?" + queryStringParams}`, {
                headers: {
                    authorization: `Bearer ${thunkAPI.getState().userSlice.token}`
                }
            });
            return {
                employees: response.data.employees,
                totalPage: response.data.totalPage
            }
        } catch (err) {
            return thunkAPI.rejectWithValue(err)
        }
    }
)

export const deleteEmployee = createAsyncThunk<any, { employeeId: string }>(
    "employeesSlice/deleteEmployee",
    async (data, thunkAPI: any) => {
        try {
            const response = await axios.delete(`/api/employee/delete/${data.employeeId}`, {
                headers: {
                    authorization: `Bearer ${thunkAPI.getState().userSlice.token}`
                }
            })
            if (response.status === 200) {
                thunkAPI.dispatch(getEmployeesByUser({
                    searchEmployeesValue: "",
                    pageItems: "10",
                    currentPage: "1",
                    statusSearch: "all"
                }))
            }
        } catch (err) {
            return thunkAPI.rejectWithValue(err)
        }
    }
)

export const createEmployee = createAsyncThunk<{ status: number }, ICreateEmployeeFrom>(
    "employeesSlice/createEmployee",
    async (data, thunkAPI: any) => {
        try {
            const response = await axios.post("/api/employee/add", data, {
                headers: {
                    authorization: `Bearer ${thunkAPI.getState().userSlice.token}`
                }
            })
            return {
                status: response.status
            }
        } catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
)

const employeesSlice = createSlice({
    name: "employeesSlice",
    initialState,
    reducers: {
        changeStatusByEmployee: (state, action) => {
            const findEmployee = state.employees.find(employee => employee.id === action.payload.employeeId)

            if (findEmployee && findEmployee.status !== "completed") {
                findEmployee.status = "completed"
            }


        }
    },
    extraReducers: (builder) => {
        builder
            /*GET EMPLOYEES*/
            .addCase(getEmployeesByUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(getEmployeesByUser.fulfilled, (state, action: PayloadAction<IEmployeesDataRes>) => {
                state.employees = action.payload.employees;
                state.totalPage = action.payload.totalPage;
                state.loading = false;
            })
            .addCase(getEmployeesByUser.rejected, (state) => {
                state.loading = false;
            })
            /*DELETE EMPLOYEE*/
            .addCase(deleteEmployee.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteEmployee.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteEmployee.rejected, (state) => {
                state.loading = false
            })
            /*CREATE EMPLOYEE*/
            .addCase(createEmployee.pending, (state) => {
                state.loading = true;
            })
            .addCase(createEmployee.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createEmployee.rejected, (state) => {
                state.loading = false;
            })
    }
})

export const {changeStatusByEmployee} = employeesSlice.actions;
export default employeesSlice.reducer