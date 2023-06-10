import React, {FC, MouseEvent, useCallback, useState} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {makeStyles} from "tss-react/mui";
import {TEmployees} from "../utils/type";
import ConfirmationModal from "./ConfirmationModal";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {deleteEmployee} from "../features/employeesSlice";
import {useNavigate} from "react-router-dom";


interface IEmployeeItem {
    employeeItem: TEmployees,
}

const useStyleEmployeeItem = makeStyles()({
    employeesPageTableRow: {
        padding: "15px",
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "10px",
        alignItems: "center",
        cursor: "pointer",
        transition: "all 0.8s ease",
        "&:nth-child(2n)": {
            backgroundColor: "#0e0e0b59",
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
    },
    employeesPageTableRowActionBtn: {
        border: "1px solid #FFFFFF",
        color: "#FFFFFF",
    },
})

const EmployeeItem: FC<IEmployeeItem> = ({employeeItem}) => {

    const dispatch = useAppDispatch();

    const {loading} = useAppSelector(store => store.employeesSlice);

    const handleDeleteEmployee = useCallback((idEmployee: string) => {
        dispatch(deleteEmployee({employeeId: employeeItem.id}))
    }, [])

    const {classes} = useStyleEmployeeItem();

    const {id, age, address, firstName, lastName, email, status} = employeeItem

    const [openConfirmDeleteEmployeeModal, setOpenConfirmDeleteEmployeeModal] = useState(false);

    const navigation = useNavigate();

    const handleOpenConfirmDeleteEmployeeModal = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setOpenConfirmDeleteEmployeeModal(true);
    }

    return (
        <>
            <ConfirmationModal title="Delete employes" description={`You sure want to delete employee ${firstName} ? `}
                               open={openConfirmDeleteEmployeeModal} setOpen={setOpenConfirmDeleteEmployeeModal}
                               handler={() => handleDeleteEmployee(id)}
                               loading={loading}
            />
            <Box className={classes.employeesPageTableRow} key={id} onClick={() => navigation(`/employee/${employeeItem.id}`)}>
                <Box sx={{wordBreak: "break-word"}}>{email}</Box>
                <Box>{firstName}</Box>
                <Box>{lastName}</Box>
                <Box>{age}</Box>
                <Box>{address}</Box>
                <Box sx={{color: status === "invited" ? "#ff2b2b" : "#00ff00"}}>{status}</Box>
                <Box sx={{textAlign: "center"}}>
                    <Button onClick={handleOpenConfirmDeleteEmployeeModal} variant="outlined"
                            className={classes.employeesPageTableRowActionBtn}>
                        Delete
                    </Button>
                </Box>
            </Box>
        </>
    )
}

export default React.memo(EmployeeItem);