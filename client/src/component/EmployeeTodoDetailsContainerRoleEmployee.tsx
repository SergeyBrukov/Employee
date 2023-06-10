import React, {useEffect, useRef, useState} from "react"
import Box from "@mui/material/Box";
import {makeStyles} from "tss-react/mui";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {useParams} from "react-router-dom";
import {
    changeTodoComplete,
    changeTodoStatusDetailItem,
    clearTodo,
    getTodoItemByEmployee
} from "../features/employeeItemTodoSlice";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import {parseIntoFormatText} from "../utils/customFunk";
import Switch from '@mui/material/Switch';
import {regex} from "../utils/constants";
import TodoModalChangeComplete from "./TodoModalChangeComplete";
import {socket} from "../utils/socket";
import {changeTodoStatus} from "../features/employeeTodoSlice";
import jwtDecode from "jwt-decode";

const StyledEmployeeTodoDetailsContainer = makeStyles()({
    employeeTodoContainer: {
        margin: "50px auto 0",
        padding: "50px 25px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "15px",
        background: "#0E0E0B",
        borderRadius: "12px"
    },
    employeeTodoInfoBlock: {
        width: "100%",
        maxWidth: "500px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        ".MuiSwitch-track": {
            background : "#FFFFFF"
        }
    },
    employeeTodoInfoNameField: {
        display: "block",
        marginBottom: "5px",
        color: "#FFFFFF"
    },
    employeeTodoInfoValueField: {
        padding: "10px 10px",
        backgroundColor: "#FFFFFF",
        borderRadius: "20px",
        color: "#0E0E0B"
    }
})

const EmployeeTodoDetailsContainerRoleEmployee = () => {
    const {classes} = StyledEmployeeTodoDetailsContainer();

    const dispatch = useAppDispatch();
    const {todo, loading} = useAppSelector(store => store.employeeItemTodoSlice);

    const {id: todoId} = useParams();

    const [visibleModalChangeComplete, setVisibleModalChangeComplete] = useState<boolean>(false);

    useEffect(() => {
        if (todoId && !todo) {
            dispatch(getTodoItemByEmployee(todoId));
        }

        if(!todo) {
            return
        }

        socket.emit("join-todo", todo.employeeId);

        socket.on("change-todo-status", (data) => {
            dispatch(changeTodoStatusDetailItem(data.todoId))
        })

        return () => {
            socket.emit("leave-room-todo", todo.employeeId);
            socket.off("change-todo-status");
            dispatch(clearTodo())
        }
    }, [todo])


    if (loading) {
        return (
            <Backdrop sx={{color: '#fff'}} open={true}>
                <CircularProgress color="inherit"/>
            </Backdrop>
        )
    }

    const handleChangeComplete = () => {
        setVisibleModalChangeComplete(true);
    }

    if(!todo) {
        return <></>
    }

    return (
        <Box className={classes.employeeTodoContainer}>
            <TodoModalChangeComplete employeeId={todo.employeeId} todoId={todoId as string} open={visibleModalChangeComplete} setOpen={setVisibleModalChangeComplete}/>
            {todo && Object.entries(todo).map(([key, value]) => {
                if (key === "complete") {
                    return (
                        <Box className={classes.employeeTodoInfoBlock} key={key}>
                            <Typography component="span" className={classes.employeeTodoInfoNameField}>
                                {parseIntoFormatText(key, regex.isCamelCase)}:
                            </Typography>
                            <Switch
                                checked={todo[key]}
                                onChange={handleChangeComplete}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </Box>
                    );
                }
                if (key !== "id") {
                    return (
                        <Box className={classes.employeeTodoInfoBlock} key={key}>
                            <Typography component="span" className={classes.employeeTodoInfoNameField}>
                                {parseIntoFormatText(key, regex.isCamelCase)}:
                            </Typography>
                            <Typography component="p" className={classes.employeeTodoInfoValueField}>
                                {value}
                            </Typography>
                        </Box>
                    );
                }
            })}
        </Box>
    )
}

export default EmployeeTodoDetailsContainerRoleEmployee