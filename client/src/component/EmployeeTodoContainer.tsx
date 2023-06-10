import React, {useEffect, useRef, useState} from "react";
import Box from "@mui/material/Box";
import {makeStyles} from "tss-react/mui";
import Button from "@mui/material/Button";
import AddBoxIcon from '@mui/icons-material/AddBox';
import TodoListByEmployee from "./TodoListByEmployee";
import CreateEmployeeTodoForm from "./CreateEmployeeTodoForm";
import PaginationPage from "./PaginationPage";
import {useParams, useSearchParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {changeTodoStatus, getTodosByEmployee} from "../features/employeeTodoSlice";
import DebounceTextField from "./DebounceTextField";
import {socket} from "../utils/socket";
import {changeTodoComplete} from "../features/employeeItemTodoSlice";


const StyleEmployeeTodoContainer = makeStyles()({
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
    employeeTodoAddNewTodoBtn: {
        border: "1px solid #FFFFFF",
        color: "#FFFFFF",
        transition: "all 0.8s ease",
        "&:hover": {
            border: "1px solid #FFFFFF",
            backgroundColor: "#FFFFFF",
            color: "#0E0E0B",
            transform: "translateY(-5px)",
            boxShadow: "rgb(38, 57, 77) 0px 20px 30px -10px",
            transition: "all 0.8s ease",
        },
        "&:active": {
            transform: "translateY(0)",
            boxShadow: "none",
            transition: "all 0.4s ease",
        }
    },
    employeeTodoTabSearchInput: {
        width: "100%",
        "input": {
            borderRadius: "20px",
            background: "#FFFFFF",
        },
        "& fieldset": {border: 'none'}
    },
    employeeTodoTabFilterBlock: {
        marginBottom: "40px",
        width: "100%",
        display: "grid",
        gridTemplateColumns: "140px 1fr",
        alignItems: "center",
        gap: "25px"
    }
})
const EmployeeTodoContainer = () => {

    const {classes} = StyleEmployeeTodoContainer();
    const {totalPage} = useAppSelector(store => store.employeeTodoSlice)

    const [searchParams, setSearchParams] = useSearchParams()

    const dispatch = useAppDispatch();

    const didMount = useRef(true);

    const queryObject = Object.fromEntries(searchParams);

    const {id: employeeId} = useParams();

    const [openCreateTodoModal, setOpenCreateTodoModal] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState<string>(searchParams.get("page") || "1")
    const [searchTodoForEmployee, setSearchTodoForEmployee] = useState<string>(searchParams.get("searchTodoForEmployee") || "")

    const handleChangePage = (page: number) => {
        if (queryObject.page !== String(page)) {
            setSearchParams({...queryObject, page: String(page)})
        }
    }

    const handleChangeValueSearchTodoForEmployee = (value: string) => {
        setSearchParams({...queryObject, searchTodoForEmployee: value})
    }

    const handleChangeSearchParams = () => {
        if (queryObject?.page && (queryObject?.page !== currentPage)) setCurrentPage(String(queryObject.page));
        if (queryObject?.searchTodoForEmployee && (queryObject?.searchTodoForEmployee !== searchTodoForEmployee)) {
            setSearchTodoForEmployee(queryObject.searchTodoForEmployee)
        } else if(queryObject?.searchTodoForEmployee?.length === 0 ) {
            setSearchTodoForEmployee("")
        }
    }

    useEffect(() => {
        handleChangeSearchParams();
    }, [searchParams])

    useEffect(() => {
        if (didMount.current) {
            setSearchParams({...queryObject, page: currentPage}, {replace: true})
        }

        didMount.current = false;
        dispatch(getTodosByEmployee({employeeId, page: currentPage || 1, itemPerPage: 10, searchTodoForEmployee}));
    }, [currentPage, searchTodoForEmployee])

    useEffect(() => {
        socket.emit("join-todo", employeeId);

        socket.on("change-todo-status", (data) => {
            dispatch(changeTodoStatus(data.todoId))
        })

        return () => {
            socket.emit("leave-room-todo", employeeId);
            socket.off("change-todo-status");
        }
    }, [])

    return (
        <>
            <Box className={classes.employeeTodoContainer}>
                <CreateEmployeeTodoForm open={openCreateTodoModal} setOpen={setOpenCreateTodoModal}/>

                <Box className={classes.employeeTodoTabFilterBlock}>
                    <Box sx={{width: "100%"}}>
                        <Button variant="outlined" startIcon={<AddBoxIcon/>}
                                className={classes.employeeTodoAddNewTodoBtn}
                                onClick={() => {
                                    setOpenCreateTodoModal(true);
                                }}
                        >
                            New todo
                        </Button>
                    </Box>
                    <DebounceTextField initialValue={searchTodoForEmployee} placeholder="Search todo for employee"
                                       handleChangeValue={handleChangeValueSearchTodoForEmployee}
                                       className={classes.employeeTodoTabSearchInput}/>
                </Box>
                <TodoListByEmployee/>
            </Box>
            <PaginationPage handleChange={handleChangePage} currentPage={currentPage} count={totalPage}/>
        </>
    )
}

export default EmployeeTodoContainer