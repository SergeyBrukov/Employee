import React from "react";
import Box from "@mui/material/Box";
import {makeStyles} from "tss-react/mui";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import {boolean} from "yup";

const useStyleFormLoading = makeStyles()({
    formLoadingContainer: {
        width: "100%",
        height: "100%",
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        background: "#0E0E0B",
        opacity: "0.5",
        zIndex: "100"
    }
})

interface IFormLoading {
    open: boolean
}

const FormLoading = ({open}:IFormLoading) => {
    const {classes} = useStyleFormLoading();

    return (
        <Box className={classes.formLoadingContainer} sx={{display: open ? "flex" : "none"}}>
            <Backdrop sx={{ color: '#fff' }} open={open}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    )
}

export default FormLoading