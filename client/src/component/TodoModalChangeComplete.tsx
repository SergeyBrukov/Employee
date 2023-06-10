import React, {useEffect} from "react";
import Box from "@mui/material/Box";
import {makeStyles} from "tss-react/mui";
import {Controller, useForm} from "react-hook-form";
import {changeTodoComplete} from "../features/employeeItemTodoSlice";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import FormLoading from "./FormLoading";
import Textarea from "@mui/joy/Textarea";
import {FormHelperText} from "@mui/joy";
import Button from "@mui/material/Button";
import {socket} from "../utils/socket";
import jwtDecode from "jwt-decode";
import {changeTodoStatus} from "../features/employeeTodoSlice";

interface ITodoModalChangeComplete {
    open: boolean
    setOpen: (result: boolean) => void
    todoId: string
    employeeId: string
}

const StyleTodoModalChangeComplete = makeStyles()({
    todoModalChangeCompleteContainer: {
        width: "100%",
        height: "100%",
        position: "fixed",
        top: "0",
        alignItems: "center",
        justifyContent: "center",
        background: "#0e0e0b8f",
        zIndex: "10"
    },
    todoModalChangeCompleteBlock: {
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
    todoModalChangeCompleteTextarea: {
        width: "75%",
        "input": {
            borderRadius: "20px",
            background: "#FFFFFF",
        },
        "& fieldset": {border: 'none'}
    },
    todoModalChangeCompleteActionBtn: {
        padding: "10px 25px",
        color: "#FFFFFF",
        borderColor: "#FFFFFF"
    },
})

const TodoModalChangeComplete = ({open, setOpen, todoId, employeeId}: ITodoModalChangeComplete) => {

    const {classes} = StyleTodoModalChangeComplete();

    const dispatch = useAppDispatch();
    const {loading} = useAppSelector(store => store.employeeItemTodoSlice);

    const {handleSubmit, control} = useForm({mode: "onSubmit"});

    const handleChangeTodoStatus = () => {
        if (todoId) {
            dispatch(changeTodoComplete(todoId)).then((resp: any) => {
                if(resp.payload.status === 200) {
                    setOpen(false);
                    socket.emit("todo-complete", {room: employeeId, todoId});
                }
            })
        }
    }

    return (
        <Box sx={{display: open ? "flex" : "none"}} className={classes.todoModalChangeCompleteContainer}
             onClick={() => setOpen(false)}>
            <Box component="form" className={classes.todoModalChangeCompleteBlock}
                 onSubmit={handleSubmit(handleChangeTodoStatus)} onClick={e => e.stopPropagation()}>
                <FormLoading open={loading}/>
                <Controller control={control} render={({field: {value, onChange}, fieldState: {error}}) => (
                    <>
                        <Textarea minRows={2} value={value} onChange={onChange} placeholder="Please enter todo description"
                                  className={classes.todoModalChangeCompleteTextarea}/>
                        {error && <FormHelperText sx={{width: "68%", top: "-10px", left: "-10px", position: "relative", color: "#d32f2f", fontSize: "0.75rem"}}>{error?.message}</FormHelperText>}
                    </>
                )} name="completeDescription" defaultValue=""/>
                <Button variant="outlined" type="submit" className={classes.todoModalChangeCompleteActionBtn}>Change status todo</Button>
            </Box>
        </Box>
    )
}

export default TodoModalChangeComplete