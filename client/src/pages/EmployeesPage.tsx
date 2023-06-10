import React, {useEffect, useRef, useState} from "react";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {changeStatusByEmployee, getEmployeesByUser} from "../features/employeesSlice";
import {makeStyles} from "tss-react/mui";
import EmployeeItem from "../component/EmployeeItem";
import PageLimitItems from "../component/PageLimitItems";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import PaginationPage from "../component/PaginationPage";
import Alert from '@mui/material/Alert';
import queryString from 'query-string';
import DebounceTextField from "../component/DebounceTextField";


import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {socket} from "../utils/socket";


const useStyleEmployeesPage = makeStyles()({
    employeesPageWrapper: {},
    employeesPageTableContainer: {},
    employeesPageTableHead: {
        padding: "15px",
        marginBottom: "10px",
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        alignItems: "center",
        backgroundColor: "#0E0E0B",
        color: "#FFFFFF"
    },
    employeesPageAddNewEmployeeBtn: {
        marginBottom: "40px",
        border: "1px solid #0E0E0B",
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
    employeesPageActionBlock: {
        display: "flex",
        flexDirection: "column",
        gap: "35px"
    },
    employeesPageSearchInput: {
        width: "100%",
        "input": {
            borderRadius: "20px",
            background: "#FFFFFF",
        },
        "& fieldset": {border: 'none'}
    },
    employeesPageFilterBlock: {
        display: "flex",
        alignItems: "center",
        gap: "25px"
    },
    statusSelect: {
        "div": {
            padding: "6px 14px"
        },
        '.MuiOutlinedInput-notchedOutline': {
            borderColor: "#0E0E0B",
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: "1px solid #0E0E0B"
        },
    },
    statusSelectLabel: {
        paddingBottom: "5px",
        color: "#FFFFFF"
    }
})


const EmployeesPage = () => {

    const [searchParams, setSearchParams] = useSearchParams();

    const navigation = useNavigate();

    const didMount = useRef(true)

    const queryObject = Object.fromEntries(searchParams);

    const [pageItems, setPageItems] = useState<string>(queryObject.pageItems ? String(queryObject.pageItems) : '10');
    const [currentPage, setCurrentPage] = useState<string>(queryObject.page ? String(queryObject.page) : "1");
    const [searchEmployeesValue, setSearchEmployeesValue] = useState<string>(queryObject.searchEmployees ? String(queryObject.searchEmployees) : "")
    const [statusSearch, setStatusSearch] = useState(queryObject.statusSearch ? String(queryObject.statusSearch) : "all")

    const {classes} = useStyleEmployeesPage();

    const dispatch = useAppDispatch();

    const {employees, totalPage} = useAppSelector(store => store.employeesSlice)

    const handleChangeSearchParamsAttributesQueryParam = () => {

        if (queryObject?.page && (queryObject?.page !== currentPage)) setCurrentPage(String(queryObject.page));

        if (queryObject?.pageItems && (queryObject?.pageItems !== pageItems)) setPageItems(String(queryObject.pageItems));

        if (queryObject?.statusSearch && (queryObject?.statusSearch !== statusSearch)) {
            setStatusSearch(String(queryObject.statusSearch))
        }

        if (queryObject?.searchEmployeesValue && (queryObject?.searchEmployeesValue !== statusSearch)) {
            setSearchEmployeesValue(String(queryObject.searchEmployeesValue))
        } else if(queryObject?.searchEmployeesValue?.length === 0 ){
            setSearchEmployeesValue("")
        }
    }

    useEffect(() => {
        handleChangeSearchParamsAttributesQueryParam();
    }, [searchParams])


    useEffect(() => {
        socket.on("connectInviteEmployee", (data) => {
            dispatch(changeStatusByEmployee({employeeId: data}))
        })
    }, [])


    useEffect(() => {
        if (didMount.current) {
            setSearchParams({...queryObject, page: currentPage, pageItems})
            didMount.current = false
        }

        dispatch(getEmployeesByUser({pageItems, currentPage, searchEmployeesValue, statusSearch}));

    }, [pageItems, currentPage, searchEmployeesValue, statusSearch])


    const handleChangeSelect = (e: SelectChangeEvent) => {
        setSearchParams({...queryObject, statusSearch: e.target.value})
    }

    const handleChangeValue = (value: string) => {
        setSearchParams({...queryObject, searchEmployeesValue: value})
    }

    const handleChangeItemPerPage = (event: SelectChangeEvent) => {
        setSearchParams({...queryObject, pageItems: event.target.value})
    }

    const handleChangePage = (page: number) => {
        setSearchParams({...queryObject, page: String(page)})
    }

    return (
        <Box className={classes.employeesPageWrapper}>
            <Box className={classes.employeesPageActionBlock}>
                <Box className={classes.employeesPageFilterBlock}>
                    <PageLimitItems pageItems={pageItems} handleChange={handleChangeItemPerPage}/>
                    <DebounceTextField handleChangeValue={handleChangeValue} placeholder="Please enter search employee"
                                       initialValue={searchEmployeesValue} setDebounceValue={setSearchEmployeesValue}
                                       className={classes.employeesPageSearchInput}/>
                    <Box sx={{maxWidth: 150, width: "100%"}}>
                        <InputLabel className={classes.statusSelectLabel}>Status</InputLabel>
                        <FormControl fullWidth>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                className={classes.statusSelect}
                                value={statusSearch}
                                label="Age"
                                onChange={handleChangeSelect}
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="invited">Invited</MenuItem>
                                <MenuItem value="completed">Complited</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <Box>
                    <Button
                        variant="outlined" startIcon={<PersonAddAlt1Icon/>}
                        className={classes.employeesPageAddNewEmployeeBtn}
                        onClick={() => navigation('/create-employee')}
                    >
                        New employee
                    </Button>
                </Box>
            </Box>

            {employees.length > 0 ? <Box className={classes.employeesPageTableContainer}>
                <Box className={classes.employeesPageTableHead}>
                    <Box>Email</Box>
                    <Box>Name</Box>
                    <Box>Surname</Box>
                    <Box>Age</Box>
                    <Box>Address</Box>
                    <Box>Status</Box>
                    <Box sx={{textAlign: "center"}}>Action</Box>
                </Box>
                {employees.map(employeeItem => {
                    return (
                        <EmployeeItem employeeItem={employeeItem} key={employeeItem.id}/>
                    )
                })}
            </Box> : <Alert severity="info">This is an info alert — check it out!</Alert>}
            <PaginationPage currentPage={currentPage} handleChange={handleChangePage} count={totalPage}/>
        </Box>
    )
}

export default EmployeesPage