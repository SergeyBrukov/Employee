import React, {useMemo} from "react";
import Box from "@mui/material/Box";
import {useLocation, useNavigate} from "react-router-dom";
import {makeStyles} from "tss-react/mui";


const useStyleTabLoginRegister = makeStyles()({
    tabContainer: {
        paddingTop: "10px",
        width: "100%",
        height: "60px",
        maxWidth: "270px",
        position: "absolute",
        left: "0",
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        background: "#0E0E0B",
        borderRadius: "12px",
        "button": {
            width: "125px",
            maxHeight: "40px",
            cursor: "pointer"
        }
    }
})

const TabLoginRegister = () => {

    const {classes} = useStyleTabLoginRegister()

    const navigate = useNavigate();

    const {pathname} = useLocation();

    const examinationLoginOrRegisterPage = (pathname: string) => {
        switch (pathname) {
            case "login": {
                return "-50px"
            }
            case "register": {
                return "-65px"
            }
            default: {
                return "-50px"
            }
        }
    }

    const examinationLoginOrRegisterPageMemo = useMemo(() => examinationLoginOrRegisterPage(pathname.split("/")[0]), [pathname])

    return (
        <Box className={classes.tabContainer} sx={{top: examinationLoginOrRegisterPageMemo}}>
            <button type="button" style={{border: pathname.split("/")[1] === "login" ? "2px solid black" : "none"}} onClick={() => navigate("/login")}>
                login
            </button>
            <button type="button" style={{border: pathname.split("/")[1] === "register" ? "2px solid black" : "none"}} onClick={() => navigate("/register")}>
                Registration
            </button>
        </Box>
    )
}
export default TabLoginRegister