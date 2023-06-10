import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    ILoginDataReq,
    ILoginDataRes,
    IRegisterDataReq,
    IRegisterDataRes,
    IRegisterEmployeeDataReq
} from "../utils/interface";
import axios from "axios";


interface IInitialState {
    token: string | null,
    role: string | null,
    name: string,
    loading: boolean
}

const initialState: IInitialState = {
    token: localStorage.getItem("userToken") || null,
    role: null,
    name: "",
    loading: false
}

export const userLoginThunk = createAsyncThunk<ILoginDataRes, ILoginDataReq>(
    "userSlice/userLoginThunk",
    async (data, thunkAPI) => {
        try {
            const response = await axios.post("/api/users/login", data)

            return {
                token: response.data.token,
                role: response.data.role,
                status: response.status,
                name: response.data.name
            }
        } catch (err) {
            return thunkAPI.rejectWithValue(err)
        }
    }
)

export const userRegisterThunk = createAsyncThunk<IRegisterDataRes, IRegisterDataReq>(
    "userSlice/userRegisterThunk",
    async (data, thunkAPI) => {
        try {
            const response = await axios.post('/api/users/register', data);

            return {
                token: response.data.token,
                role: response.data.role,
                status: response.status,
                name: response.data.name
            }
        } catch (err) {
            return thunkAPI.rejectWithValue(err)
        }
    }
)


export const employeeInviteRegisterThunk = createAsyncThunk<IRegisterDataRes, IRegisterEmployeeDataReq>(
    "userSlice/employeeInviteRegisterThunk",
    async (data, thunkAPI) => {
        try {
            const response = await axios.post('/api/employee/register', data);

            return {
                token: response.data.token,
                role: response.data.role,
                status: response.status,
                name: response.data.name
            }
        } catch (err) {
            return thunkAPI.rejectWithValue(err)
        }
    }
)

export const getCurrentUser = createAsyncThunk<ILoginDataRes>(
    "userSlice/getCurrentUser",
    async (_, thunkAPI: any) => {
        try {
            const response = await axios('/api/users/current', {
                headers: {
                    authorization: `Bearer ${thunkAPI.getState().userSlice.token}`
                }
            })
            return {
                token: response.data.token,
                role: response.data.role,
                name: response.data.name
            }
        } catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
)


const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        Logout: (state) => {
            localStorage.removeItem("userToken")
            state.token = null
        }
    },
    extraReducers: (builder) => {
        builder
            /*LOGIN*/
            .addCase(userLoginThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(userLoginThunk.fulfilled, (state, action: PayloadAction<ILoginDataRes>) => {
                state.token = action.payload.token;
                state.role = action.payload.role;
                state.name = action.payload.name;
                localStorage.setItem("userToken", action.payload.token);
                state.loading = false
            })
            .addCase(userLoginThunk.rejected, (state) => {
                state.loading = false
            })
            /*REGISTRATION*/
            .addCase(userRegisterThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(userRegisterThunk.fulfilled, (state, action: PayloadAction<ILoginDataRes>) => {
                state.token = action.payload.token;
                state.role = action.payload.role;
                state.name = action.payload.name;
                localStorage.setItem("userToken", action.payload.token);
                state.loading = false
            })
            .addCase(userRegisterThunk.rejected, (state) => {
                state.loading = false
            })
            /*GET CURRENT USER INFO*/
            .addCase(getCurrentUser.pending, (state) => {
                state.loading = true
            })
            .addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<ILoginDataRes>) => {
                state.role = action.payload.role
                state.name = action.payload.name
                state.loading = false
            })
            .addCase(getCurrentUser.rejected, (state) => {
                state.loading = false
            })
            /*REGISTRATION EMPLOYEE BY INVITE*/
            .addCase(employeeInviteRegisterThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(employeeInviteRegisterThunk.fulfilled, (state, action: PayloadAction<ILoginDataRes>) => {
                state.token = action.payload.token;
                state.role = action.payload.role;
                state.name = action.payload.name;
                localStorage.setItem("userToken", action.payload.token);
                state.loading = false
            })
            .addCase(employeeInviteRegisterThunk.rejected, (state) => {
                state.loading = false
            })
    }
})

export const {Logout} = userSlice.actions;

export default userSlice.reducer