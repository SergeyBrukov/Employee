import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {TMessage} from "../utils/type";

interface IInitialState {
    messages: TMessage[],
    loading: boolean
}


const initialState: IInitialState = {
    messages: [],
    loading: false
}


export const getMessagesByChat = createAsyncThunk<any, any>(
    "chatWithBosSlice/getMessagesByChat",
    async (chatIdByEmployee, thunkAPI: any) => {
        try {
            const response = await axios(`/api/chat/get-messages/${chatIdByEmployee}`, {
                headers: {
                    authorization: `Bearer ${thunkAPI.getState().userSlice.token}`
                }
            })

            return {
                messages: response.data.messages,
                status: response.status
            }
        } catch (err) {
            thunkAPI.rejectWithValue(err);
        }
    }
)

export const sendMessage = createAsyncThunk<any, any>(
    "chatWithBosSlice/sendMessage",
    async (data, thunkAPI: any) => {

        const {chatIdByEmployee, ...otherData} = data;


        try {
            const response = await axios.post(`/api/chat/send-message/${chatIdByEmployee}`, otherData, {
                headers: {
                    authorization: `Bearer ${thunkAPI.getState().userSlice.token}`
                }
            })

            if (response.status === 201) {
                thunkAPI.dispatch(addNewMessageByChat(response.data.message))
            }

            return {
                status: response.status,
                message: response.data.message
            }
        } catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
)

const chatWithBosSlice = createSlice({
    name: "chatWithBosSlice",
    initialState,
    reducers: {
        addNewMessageByChat: (state, action) => {
            state.messages.unshift(action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
            /*SEND NEW MESSAGE*/
            .addCase(sendMessage.pending, (state) => {
            })
            .addCase(sendMessage.fulfilled, (state) => {
            })
            .addCase(sendMessage.rejected, (state) => {
            })

            /*GET MESSAGES*/
            .addCase(getMessagesByChat.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMessagesByChat.fulfilled, (state, action) => {
                state.messages = action.payload.messages
                state.loading = false;
            })
            .addCase(getMessagesByChat.rejected, (state) => {
                state.loading = false;
            })
    }
})


export const {addNewMessageByChat} = chatWithBosSlice.actions
export default chatWithBosSlice.reducer