import React, {memo, useEffect} from "react"
import Box from "@mui/material/Box";
import {useLocation, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {getTodosByEmployee} from "../features/employeeTodoSlice";
import Alert from "@mui/material/Alert";
import {makeStyles} from "tss-react/mui";
import TodoItem from "./TodoItem";
import queryString from "query-string";


const StyleTodoListByEmployee = makeStyles()({
    todoPageTableContainer: {},
    todoPageTableHead: {
        padding: "15px",
        marginBottom: "10px",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        alignItems: "center",
        backgroundColor: "#0E0E0B",
        color: "#FFFFFF"
    }
})

const TodoListByEmployee = () => {

    const {classes} = StyleTodoListByEmployee();

    const {todo} = useAppSelector(store => store.employeeTodoSlice);

    return (
        <Box sx={{width: "100%"}}>
            {(todo && todo.length > 0) ? <Box className={classes.todoPageTableContainer}>
                <Box className={classes.todoPageTableHead}>
                    <Box>Id</Box>
                    <Box>Title</Box>
                    <Box>Description</Box>
                    <Box>Complete</Box>
                </Box>
                {todo.map(todo => <TodoItem todo={todo} key={todo.id}/>)}
            </Box> : <Alert severity="info">This is an info alert — check it out!</Alert>}
        </Box>
    )
}

export default memo(TodoListByEmployee)