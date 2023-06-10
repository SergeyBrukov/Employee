import React from "react";
import Box from "@mui/material/Box";
import {makeStyles} from "tss-react/mui";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {IRegisterEmployeeForm} from "../utils/interface";

import * as yup from "yup"
import {yupResolver} from '@hookform/resolvers/yup';
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {employeeInviteRegisterThunk} from "../features/userSlice";
import {useNavigate, useParams} from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormLoading from "../component/FormLoading";

const useStyleRegisterPage = makeStyles()({
    RegisterPageWrapper: {
        width: "100%",
        height: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    RegisterPageContainer: {
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
    RegisterPageFormBtn: {
        padding: "10px 25px",
        color: "#FFFFFF",
        borderColor: "#FFFFFF"
    },
    RegisterPageInput: {
        width: "75%",
        "input": {
            borderRadius: "20px",
            background: "#FFFFFF",
        },
        "& fieldset": {border: 'none'}
    }
})

const RegisterPage = () => {

    const {token, email} = useParams();

    const {classes} = useStyleRegisterPage();
    const {loading} = useAppSelector(store => store.userSlice)

    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const registerFormValidation = yup.object({
        email: yup.string().required("This field con not be empty").min(6, "Field must be more 5 length"),
        password: yup.string().required("This field con not be empty").min(6, "Field must be more 5 length")
    })

    const {handleSubmit, control} = useForm<IRegisterEmployeeForm>({
        mode: "onSubmit",
        resolver: yupResolver(registerFormValidation)
    })

    const handleSubmitRegisterForm: SubmitHandler<IRegisterEmployeeForm> = (data) => {

        dispatch(employeeInviteRegisterThunk({...data, token: token || ""})).then((response: any) => {
            if (response.payload.status === 200) {
                navigate("/employee-page")
            }
        })
    }

    return (
        <Box className={classes.RegisterPageWrapper}>
            <Box className={classes.RegisterPageContainer} component="form"
                 onSubmit={handleSubmit(handleSubmitRegisterForm)}>
                <FormLoading open={loading}/>
                <Controller control={control} defaultValue={email ? email : ""}
                            render={({field: {value, onChange}, fieldState: {error}}) => (
                                <TextField placeholder="Please enter email" className={classes.RegisterPageInput}
                                           error={!!error} value={value} onChange={onChange} helperText={
                                    error?.message
                                }/>
                            )} name="email"/>
                <Controller control={control} defaultValue=""
                            render={({field: {value, onChange}, fieldState: {error}}) => (
                                <TextField placeholder="Please enter password" className={classes.RegisterPageInput}
                                           error={!!error} value={value} onChange={onChange} helperText={
                                    error?.message
                                }/>
                            )} name="password"/>
                <Button variant="outlined" type="submit" className={classes.RegisterPageFormBtn}>Registration</Button>
            </Box>
        </Box>
    )
}

export default RegisterPage