import React, {useLayoutEffect} from 'react';
import Router from "./router/Router";
import axios from "axios";
import {useAppDispatch} from "./app/hooks";
import {getCurrentUser} from "./features/userSlice";

axios.defaults.baseURL = "http://localhost:3002"

function App() {

    const token = localStorage.getItem("userToken");


    const dispatch = useAppDispatch();

    useLayoutEffect(() => {
        if (!token) {
            return;
        }
        dispatch(getCurrentUser());
    }, [])


    return <Router/>

}

export default App;
