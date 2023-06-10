import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {TEmployees} from "../utils/type";
import {IEmployeeDetailInfoRes} from "../utils/interface";

interface IInitialState {
    employeeDetailsInfo: TEmployees | null,
    loading: boolean
}

const initialState:IInitialState = {
    employeeDetailsInfo: null,
    loading: false
}

export const employeeDetail = createAsyncThunk<{employee: IEmployeeDetailInfoRes},{employeeId: string}>(
    "employeeDetailSlice/employeeDetail",
    async ({employeeId}, thunkAPI: any) => {
        try {
            const response = await axios(`/api/employee/${employeeId}`, {
                headers: {
                    authorization: `Bearer ${thunkAPI.getState().userSlice.token}`
                }
            });

            return {
                employee: response.data.employee,
                status: response.status
            }
        }catch (err) {
            return thunkAPI.rejectWithValue(err)
        }
    }
)

export const changeEmployeeDetail = createAsyncThunk<any, any>(
    "employeeDetailSlice/changeEmployeeDetail",
    async (data, thunkAPI:any) => {
        try {
            const response = await axios.patch(`/api/employee/edit/${data.employeeId}`, data, {
                headers: {
                    authorization: `Bearer ${thunkAPI.getState().userSlice.token}`
                }
            })

            return {
                updateEmployee: response.data.updateEmployee
            }
        }catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
)


const employeeDetailSlice = createSlice({
    name: "employeeDetailSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(employeeDetail.pending, (state) => {
                state.loading = true;
            })
            .addCase(employeeDetail.fulfilled, (state, action:PayloadAction<{employee: IEmployeeDetailInfoRes}>) => {
                state.loading = false;
                state.employeeDetailsInfo = action.payload.employee;
            })
            .addCase(employeeDetail.rejected, (state) => {
                state.loading = false;
            })
            /*CHANGE EMPLOYEE INFO*/

            .addCase(changeEmployeeDetail.pending, (state) => {
                state.loading = true;
            })
            .addCase(changeEmployeeDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.employeeDetailsInfo = action.payload.updateEmployee;
            })
            .addCase(changeEmployeeDetail.rejected, (state) => {
                state.loading = false;
            })
    }
});

export default employeeDetailSlice.reducer