import React, {FC} from 'react'
import Box from "@mui/material/Box";
import {TEmployees} from "../utils/type";
import Typography from "@mui/material/Typography";
import {makeStyles} from "tss-react/mui";
import {parseIntoFormatText} from "../utils/customFunk";
import {regex} from "../utils/constants";


interface IEmployeeDetailsInfo {
    employeeDetailsInfo: TEmployees
}


const StyleEmployeeDetailInfo = makeStyles()({
    employeeDetailInfoContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },
    employeeDetailInfoBlock: {},
    employeeDetailInfoNameField: {
        display: "block",
        marginBottom: "5px",
        color: "#FFFFFF"
    },
    employeeDetailInfoValueField: {
        padding: "10px 10px",
        backgroundColor: "#FFFFFF",
        borderRadius: "20px",
        color: "#0E0E0B"
    }
})

const EmployeeDetailInfo:FC<IEmployeeDetailsInfo> = ({employeeDetailsInfo}) => {

    const {classes} = StyleEmployeeDetailInfo();

    return (
        <Box className={classes.employeeDetailInfoContainer}>
            {Object.entries(employeeDetailsInfo).map(([key, value]) => {
                if (key !== "userId") {
                    return (
                        <Box className={classes.employeeDetailInfoBlock} key={key}>
                            <Typography component="span" className={classes.employeeDetailInfoNameField}>
                                {parseIntoFormatText(key, regex.isCamelCase)}:
                            </Typography>
                            <Typography component="p" className={classes.employeeDetailInfoValueField}>
                                {value}
                            </Typography>
                        </Box>
                    )
                }
            })}
        </Box>
    )
}

export default EmployeeDetailInfo