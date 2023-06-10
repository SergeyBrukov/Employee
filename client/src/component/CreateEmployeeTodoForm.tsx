import React, {useEffect} from "react"
import Box from "@mui/material/Box";
import {makeStyles} from "tss-react/mui";
import {useForm, Controller, SubmitHandler} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from 'yup'
import {TCreateTodo} from "../utils/type";
import TextField from "@mui/material/TextField";
import Textarea from '@mui/joy/Textarea';
import Button from "@mui/material/Button";
import {FormHelperText} from "@mui/joy";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {createTodoByEmployee} from "../features/employeeTodoSlice";
import {useParams} from "react-router-dom";
import FormLoading from "./FormLoading";
import {socket} from "../utils/socket";

interface ICreateEmployeeTodoForm {
    open: boolean,
    setOpen: (state:boolean) => void
}

const StyleCreateEmployeeTodoForm = makeStyles()({
    createEmployeeTodoFromContainer: {
        width: "100%",
        height: "100%",
        position: "fixed",
        top: "0",
        alignItems: "center",
        justifyContent: "center",
        background: "#0e0e0b8f",
        zIndex: "10"
    },
    createEmployeeTodoFromBlock: {
        padding: "50px 25px",
        width: "100%",
        maxWidth: "800px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "15px",
        background: "#2e2e2e",
        borderRadius: "12px"
    },
    createEmployeeTodoFormInput: {
        width: "75%",
        "input": {
            borderRadius: "20px",
            background: "#FFFFFF",
        },
        "& fieldset": {border: 'none'}
    },
    createTodoFormBtn: {
        padding: "10px 25px",
        color: "#FFFFFF",
        borderColor: "#FFFFFF"
    },
})

const CreateEmployeeTodoForm = ({open,setOpen}:ICreateEmployeeTodoForm) => {

    const {classes} = StyleCreateEmployeeTodoForm();

    const {id: employeeId} = useParams();

    const dispatch = useAppDispatch();

    const {loading}= useAppSelector(store => store.employeeTodoSlice)

    const examinationField = yup.object({
        title: yup.string().required("This field can not be empty").min(6, "Field must be more 5 symbol"),
        description: yup.string().required("This field can not be empty").min(6, "Field must be more 5 symbol")
    })

    const {handleSubmit, control} = useForm<TCreateTodo>({mode: "onSubmit", resolver: yupResolver(examinationField)})

    const handleCreateTodoByEmployee:SubmitHandler<TCreateTodo> = (data) => {
        if(!employeeId) {
            return alert("employeeId was not found")
        }
        dispatch(createTodoByEmployee({...data, employeeId})).then((res: any) => {
            if(res.payload.status === 201) {
                setOpen(false);

                socket.emit("new-todo", {todo: res.payload.todo, employeeId})
            }
        })
    }

    return (
        <Box sx={{display: open ? "flex" : "none"}} className={classes.createEmployeeTodoFromContainer} onClick={() => setOpen(false)}>
            <Box component="form" className={classes.createEmployeeTodoFromBlock} onSubmit={handleSubmit(handleCreateTodoByEmployee)} onClick={e => e.stopPropagation()}>
                <FormLoading open={loading}/>
                <Controller name="title" control={control} defaultValue="" render={({field: {value, onChange}, fieldState: {error}}) => (
                    <TextField value={value} onChange={onChange} placeholder="Please enter todo title"
                               error={!!error} helperText={error?.message}
                               className={classes.createEmployeeTodoFormInput}/>
                )}/>
                <Controller name="description" control={control} defaultValue="" render={({field: {value, onChange}, fieldState: {error}}) => (
                    <>
                        <Textarea minRows={2} value={value} onChange={onChange} placeholder="Please enter todo description"
                                  className={classes.createEmployeeTodoFormInput}/>
                        {error && <FormHelperText sx={{width: "68%", top: "-10px", left: "-10px", position: "relative", color: "#d32f2f", fontSize: "0.75rem"}}>{error?.message}</FormHelperText>}
                    </>
                )}/>
                <Button variant="outlined" type="submit" className={classes.createTodoFormBtn}>Create todo</Button>
            </Box>
        </Box>
    )
}

export default CreateEmployeeTodoForm;