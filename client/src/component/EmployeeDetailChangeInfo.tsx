import React, {FC} from "react";
import {TEmployees} from "../utils/type";
import Box from "@mui/material/Box";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import TextField from "@mui/material/TextField";
import {parseIntoFormatText} from "../utils/customFunk";
import {regex} from "../utils/constants";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {makeStyles} from "tss-react/mui";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {match} from "assert";
import {useAppDispatch} from "../app/hooks";
import {changeEmployeeDetail} from "../features/employeeDetailSlice";

type TEmployeesWithOutId = Omit<TEmployees, "id">

interface IEmployeeDetailsInfo {
    employeeDetailsInfo: TEmployees
}

const StyleEmployeeDetailChangeInfo = makeStyles()({
    employeeDetailChangeInfoInput: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: "20px",
        color: "#0E0E0B",
        "input": {
            padding: "10px",
            borderRadius: "20px",
            background: "#FFFFFF",
        },
        "& fieldset": {border: 'none'}
    },
    employeeDetailChangeInfoFromNameField: {
        margin: "0 auto 0 0",
        display: "block",
        textAlign: "start",
        color: "#FFFFFF"
    },
    employeeDetailChangeInfoFromContainer: {
        padding: "50px 25px",
        width: "100%",
        maxWidth: "500px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        background: "#0E0E0B",
        borderRadius: "12px"
    },
    employeeDetailChangeInfoFromBtn: {
        marginTop: "15px",
        padding: "10px 25px",
        color: "#FFFFFF",
        borderColor: "#FFFFFF",
        "&.Mui-disabled": {
            color: "#FFFFFF",
            borderColor: "#FFFFFF",
        }
    },
})


const EmployeeDetailChangeInfo: FC<IEmployeeDetailsInfo> = ({employeeDetailsInfo}) => {

    const {classes} = StyleEmployeeDetailChangeInfo();

    const dispatch = useAppDispatch();

    const examinationFieldFormCreateEmployee = yup.object({
        firstName: yup.string().required("This field can not be empty").min(6, "Field must be more 5 symbol"),
        lastName: yup.string().required("This field can not be empty").min(6, "Field must be more 5 symbol"),
        email: yup.string().required("This field can not be empty").email("Is not valid email"),
        age: yup.string().required("This field can not be empty"),
        address: yup.string().required("This field can not be empty"),
    });

    const {control, handleSubmit, setValue, watch, formState: { isDirty }, formState} = useForm<TEmployeesWithOutId>({
        mode: "onSubmit",
        resolver: yupResolver(examinationFieldFormCreateEmployee)
    });


    const examinationChangeFieldBool = () => {

       if(!isDirty) {
           return
       }

        const defaultValues = {
            firstName: employeeDetailsInfo.firstName,
            lastName: employeeDetailsInfo.lastName,
            age: employeeDetailsInfo.age,
            email: employeeDetailsInfo.email,
            address: employeeDetailsInfo.address
        }

        //@ts-ignore
        const examinationField = Object.keys(defaultValues).some(key => defaultValues[key] !== watch(key));

        return  examinationField;

    }

    const handleSubmitChangeEmployee:SubmitHandler<TEmployeesWithOutId> = (data) => {
        dispatch(changeEmployeeDetail({...data, employeeId:employeeDetailsInfo.id}))
    }

    const missKeyEmployeeInfo = ["id", "userId", "status", "role"]

    return (
        <Box component="form" className={classes.employeeDetailChangeInfoFromContainer} onSubmit={handleSubmit(handleSubmitChangeEmployee)}>
            {Object.entries(employeeDetailsInfo).map(([key, value]) => {
                if (!missKeyEmployeeInfo.some(missKey => missKey === key)) {
                    return (
                        <Controller key={key} control={control}
                                    render={({field: {value, onChange}, fieldState: {error}}) => (
                                        <>
                                            <Typography component="span"
                                                        className={classes.employeeDetailChangeInfoFromNameField}>
                                                {parseIntoFormatText(key, regex.isCamelCase)}:
                                            </Typography>
                                            <TextField placeholder={parseIntoFormatText(key, regex.isCamelCase)}
                                                       value={value}
                                                       onChange={onChange} error={!!error} helperText={error?.message}
                                                       className={classes.employeeDetailChangeInfoInput}/>
                                        </>
                                    )} //@ts-ignore
                                    name={key} defaultValue={value}/>
                    )
                }
            })}
            <Button variant="outlined" disabled={!examinationChangeFieldBool()} type="submit" className={classes.employeeDetailChangeInfoFromBtn}>Edit employee</Button>
        </Box>
    )
}

export default EmployeeDetailChangeInfo