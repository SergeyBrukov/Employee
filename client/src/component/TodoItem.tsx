import React, {useMemo} from "react";
import {TTodo} from "../utils/type";
import Box from "@mui/material/Box";
import {makeStyles} from "tss-react/mui";
import {useNavigate} from "react-router-dom";

interface ITodoItem {
    todo: TTodo
}

const StyleTodoItem = makeStyles()({
    todoPageTableRow: {
        padding: "15px",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "15px",
        alignItems: "center",
        cursor: "pointer",
        color: "#FFFFFF",
        transition: "all 0.8s ease",
        "&:nth-child(2n)": {
            backgroundColor: "#807D75",
            color: "#FFFFFF",
        },
        "&:hover": {
            backgroundColor: "#FFFFFF",
            color: "#0E0E0B",
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
            transition: "all 0.8s ease",
            "button": {
                border: "1px solid #0E0E0B",
                color: "#0E0E0B",
            }
        }
    }
})

const TodoItem = ({todo}:ITodoItem) => {

    const {classes} = StyleTodoItem();

    const navigate = useNavigate();

    const {id, title, complete,description} = todo;

    const textParserCompleteMemo = useMemo(() => {
        if(complete) {
            return "Complete"
        }else {
            return "Not complete"
        }
    },[complete])

    return (
        <Box className={classes.todoPageTableRow} onClick={() => navigate(`/employee-todo-details-page/${id}`)}>
            <Box sx={{wordBreak: "break-word"}}>{id}</Box>
            <Box sx={{wordBreak: "break-word"}}>{title}</Box>
            <Box sx={{wordBreak: "break-word"}}>{description}</Box>
            <Box sx={{color: complete ? "#00ff00" : "#ff2b2b"}}>{textParserCompleteMemo}</Box>
        </Box>
    )
}

export default TodoItem