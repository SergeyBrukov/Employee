import React from "react";
import Box from "@mui/material/Box";
import {makeStyles} from "tss-react/mui";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {ILoginForm, MayRole} from "../utils/interface";

import * as yup from "yup"
import {yupResolver} from '@hookform/resolvers/yup';
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {userLoginThunk} from "../features/userSlice";
import {useLocation, useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import TabLoginRegister from "../component/TabLoginRegister";
import FormLoading from "../component/FormLoading";

const useStyleLoginPage = makeStyles()({
    loginPageWrapper: {
        width: "100%",
        height: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    loginPageContainer: {
        padding: "50px 25px",
        width: "100%",
        maxWidth: "500px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "15px",
        background: "#0E0E0B",
        borderRadius: "12px"
    },
    loginPageFormBtn: {
        padding: "10px 25px",
        color: "#FFFFFF",
        borderColor: "#FFFFFF"
    },
    loginPageInput: {
        width: "75%",
        "input": {
            borderRadius: "20px",
            background: "#FFFFFF",
        },
        "& fieldset": {border: 'none'}
    }
})

const LoginPage = () => {

    const {classes} = useStyleLoginPage();

    const {loading} = useAppSelector(store => store.userSlice)

    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const loginFormValidation = yup.object({
        email: yup.string().required("This field con not be empty").min(6, "Field must be more 5 length"),
        password: yup.string().required("This field con not be empty").min(6, "Field must be more 5 length")
    })

    const {handleSubmit, control} = useForm<ILoginForm>({mode: "onSubmit", resolver: yupResolver(loginFormValidation)})


    const handleSubmitLoginForm: SubmitHandler<ILoginForm> = (data) => {
        dispatch(userLoginThunk(data)).then((response: any) => {
            if (response.payload.status === 200) {
                if(response.payload.role === MayRole.OWNER) {
                    return navigate("/employees")
                }
                if(response.payload.role === MayRole.EMPLOYEE) {
                    return navigate("/employee-page")
                }
            }
        })
    }

    return (
        <Box className={classes.loginPageWrapper}>
            <Box className={classes.loginPageContainer} component="form" onSubmit={handleSubmit(handleSubmitLoginForm)}>
                <FormLoading open={loading}/>
                <TabLoginRegister/>
                <Controller control={control} defaultValue=""
                            render={({field: {value, onChange}, fieldState: {error}}) => (
                                <TextField placeholder="Please enter email" className={classes.loginPageInput}
                                           error={!!error} value={value} onChange={onChange} helperText={
                                    error?.message
                                }/>
                            )} name="email"/>

                <Controller control={control} defaultValue=""
                            render={({field: {value, onChange}, fieldState: {error}}) => (
                                <TextField placeholder="Please enter password" className={classes.loginPageInput}
                                           error={!!error} value={value} onChange={onChange} helperText={
                                    error?.message
                                }/>
                            )} name="password"/>

                <Button variant="outlined" type="submit" className={classes.loginPageFormBtn}>Login</Button>
            </Box>
        </Box>
    )
}

export default LoginPage