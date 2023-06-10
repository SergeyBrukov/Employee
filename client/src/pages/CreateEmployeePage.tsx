import React from 'react'
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {makeStyles} from "tss-react/mui";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import * as yup from "yup"
import {yupResolver} from '@hookform/resolvers/yup';
import {ICreateEmployeeFrom} from "../utils/interface";
import Button from "@mui/material/Button";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {createEmployee} from "../features/employeesSlice";
import FormLoading from "../component/FormLoading";


const StyleCreateEmployeePage = makeStyles()({
    createEmployeeFromContainer: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
    },
    createEmployeeFromTitle: {
        paddingBottom: "25px",
        textAlign: "center",
        color: "#FFFFFF",
        fontSize: "20px"
    },
    createEmployeeForm: {
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
    createEmployeeFormInput: {
        width: "75%",
        "input": {
            borderRadius: "20px",
            background: "#FFFFFF",
        },
        "& fieldset": {border: 'none'}
    },
    createEmployeeFormBtn: {
        padding: "10px 25px",
        color: "#FFFFFF",
        borderColor: "#FFFFFF"
    },
})

const CreateEmployeePage = () => {

    const {loading} = useAppSelector(store => store.employeesSlice);
    const dispatch = useAppDispatch();

    const {classes} = StyleCreateEmployeePage();

    const examinationFieldFormCreateEmployee = yup.object({
        firstName: yup.string().required("This field can not be empty").min(6, "Field must be more 5 symbol"),
        lastName: yup.string().required("This field can not be empty").min(6, "Field must be more 5 symbol"),
        age: yup.string().required("This field can not be empty"),
        address: yup.string().required("This field can not be empty"),
        email: yup.string().required("This field can not be empty").email("Field must be email"),
    })

    const {handleSubmit, control, reset} = useForm<ICreateEmployeeFrom>({
        mode: "onSubmit",
        resolver: yupResolver(examinationFieldFormCreateEmployee)
    });

    const handleSubmitCreateEmployee: SubmitHandler<ICreateEmployeeFrom> = (data) => {
        dispatch(createEmployee(data)).then((response: any) => {
            if (response.payload.status === 201) {
                 alert("Create");
                return reset();
            }
        });
    }

    return (
        <Box className={classes.createEmployeeFromContainer}>
            <Box component="form" className={classes.createEmployeeForm}
                 onSubmit={handleSubmit(handleSubmitCreateEmployee)}>
                <FormLoading open={loading}/>
                <Box className={classes.createEmployeeFromTitle}>Create employee</Box>
                <Controller control={control} name="email" defaultValue=""
                            render={({field: {value, onChange}, fieldState: {error}}) => (
                                <TextField value={value} onChange={onChange} placeholder="Please enter employee email"
                                           error={!!error} helperText={error?.message}
                                           className={classes.createEmployeeFormInput}/>
                            )}/>
                <Controller control={control} name="firstName" defaultValue=""
                            render={({field: {value, onChange}, fieldState: {error}}) => (
                                <TextField value={value} onChange={onChange} placeholder="Please enter employee name"
                                           error={!!error} helperText={error?.message}
                                           className={classes.createEmployeeFormInput}/>
                            )}/>
                <Controller control={control} name="lastName" defaultValue=""
                            render={({field: {value, onChange}, fieldState: {error}}) => (
                                <TextField value={value} onChange={onChange} placeholder="Please enter employee surname"
                                           error={!!error} helperText={error?.message}
                                           className={classes.createEmployeeFormInput}/>
                            )}/>
                <Controller control={control} name="age" defaultValue=""
                            render={({field: {value, onChange}, fieldState: {error}}) => (
                                <TextField value={value} onChange={onChange} placeholder="Please enter employee age"
                                           error={!!error} helperText={error?.message}
                                           className={classes.createEmployeeFormInput}/>
                            )}/>
                <Controller control={control} name="address" defaultValue=""
                            render={({field: {value, onChange}, fieldState: {error}}) => (
                                <TextField value={value} onChange={onChange} placeholder="Please enter employee city"
                                           error={!!error} helperText={error?.message}
                                           className={classes.createEmployeeFormInput}/>
                            )}/>
                <Button variant="outlined" type="submit" className={classes.createEmployeeFormBtn}>Create
                    employee</Button>
            </Box>
        </Box>
    )
}

export default CreateEmployeePage