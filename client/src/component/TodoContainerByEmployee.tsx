import React, {useEffect, useRef, useState} from "react";
import Box from "@mui/material/Box";
import {makeStyles} from "tss-react/mui";
import DebounceTextField from "./DebounceTextField";
import {useSearchParams} from "react-router-dom";
import PaginationPage from "./PaginationPage";
import {addNewTodoByFront, changeTodoStatus, getTodosByEmployee} from "../features/employeeTodoSlice";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import jwtDecode from "jwt-decode";
import TodoListByEmployee from "./TodoListByEmployee";
import {socket} from "../utils/socket";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const StyleTodoContainerByEmployee = makeStyles()({
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
    employeeTodoTabFilterBlock: {
        marginBottom: "40px",
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1fr 140px",
        alignItems: "center",
        gap: "25px"
    },
    employeeTodoTabSearchInput: {
        width: "100%",
        "input": {
            borderRadius: "20px",
            background: "#FFFFFF",
        },
        "& fieldset": {border: 'none'}
    },
    statusSelect: {
        "div": {
            padding: "6px 14px"
        },
        '.MuiOutlinedInput-notchedOutline': {
            borderColor: "#FFFFFF",
        },
        '& .MuiSelect-select.MuiSelect-select': { // CSS-селектор для вибраного елемента
            color: "#FFFFFF", // Встановлюємо білий колір
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: "1px solid #FFFFFF"
        },
    },
    statusSelectLabel: {
        paddingBottom: "5px",
        color: "#FFFFFF"
    }
})

const TodoContainerByEmployee = () => {
    const {classes} = StyleTodoContainerByEmployee();

    const {totalPage} = useAppSelector(store => store.employeeTodoSlice)

    const dispatch = useAppDispatch();

    const token = localStorage.getItem("userToken");
    // @ts-ignore
    const employeeId = jwtDecode(token).userId;

    const [searchParams1, setSearchParams1] = useSearchParams();

    const queryObject = Object.fromEntries(searchParams1);


    const [searchTodoValue, setSearchTodoValue] = useState<string>(queryObject.searchEmployees ? String(queryObject.searchEmployees) : "")
    const [currentPage, setCurrentPage] = useState<string>(searchParams1.get("page") || "1")
    const [statusSearch, setStatusSearch] = useState<string>(queryObject.statusSearch ? String(queryObject.statusSearch) : "all");

    const didMount = useRef(true);

    const handleChangeValueBySearchParams = () => {
        if (queryObject?.page && (queryObject?.page !== currentPage)) setCurrentPage(String(queryObject.page));


        if (queryObject?.searchTodoValue && (queryObject?.searchTodoValue !== searchTodoValue)) {
            setSearchTodoValue(String(queryObject.searchTodoValue))
        } else if(queryObject?.searchTodoValue?.length === 0 ) {
            setSearchTodoValue("")
        }

        if(queryObject?.statusSearch && (queryObject?.statusSearch !== statusSearch)) {
            setStatusSearch(String(queryObject.statusSearch))
        }
    }

    const handleChangeSearchValueTodo = (value: string) => {
        setSearchParams1({...queryObject, searchTodoValue: value});
    }

    const handleChangePage = (page: number) => {
        setSearchParams1({...queryObject, page: String(page)});
    }

    useEffect(() => {
        if (didMount.current) {
            setSearchParams1({...queryObject, page: currentPage}, {replace: true});
            didMount.current = false;
        }

        handleChangeValueBySearchParams();
    }, [searchParams1]);

    useEffect(() => {
        dispatch(getTodosByEmployee({
            employeeId,
            page: currentPage || 1,
            itemPerPage: 10,
            statusSearch: statusSearch,
            searchTodoForEmployee: searchTodoValue
        }));
    }, [searchTodoValue, currentPage, statusSearch])

    useEffect(() => {
        socket.emit("join-todo", employeeId);

        return () => {
            socket.emit("leave-room-todo", employeeId);
        }
    }, [])

    useEffect(() => {
        const handleNewTodo = (arr: any) => {
            dispatch(addNewTodoByFront(arr.todo));
        }
        socket.on("call-back-new-todo", handleNewTodo)

        socket.on("change-todo-status", (data) => {
            dispatch(changeTodoStatus(data.todoId))
        })

        return () => {
            socket.off("call-back-new-todo");
            socket.off("change-todo-status");
        }
    }, [])

    const handleChangeSelect = (event: SelectChangeEvent) => {
        setSearchParams1({...queryObject, statusSearch: event.target.value})
    }

    return (
        <>
            <Box className={classes.employeeTodoContainer}>
                <Box className={classes.employeeTodoTabFilterBlock}>
                    <DebounceTextField initialValue={searchTodoValue} placeholder="Search todo"
                                       handleChangeValue={handleChangeSearchValueTodo}
                                       className={classes.employeeTodoTabSearchInput}/>
                    <Box sx={{maxWidth: 150, width: "100%"}}>
                        <InputLabel className={classes.statusSelectLabel}>Status</InputLabel>
                        <FormControl fullWidth>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                className={classes.statusSelect}
                                value={statusSearch}
                                label="Status"
                                onChange={handleChangeSelect}
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="uncomplited">Uncomplited</MenuItem>
                                <MenuItem value="completed">Complited</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <TodoListByEmployee/>
            </Box>
            <PaginationPage count={totalPage} currentPage={currentPage} handleChange={handleChangePage}/>
        </>
    )
}

export default TodoContainerByEmployee