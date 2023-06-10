import React from "react";
import {Outlet} from "react-router-dom";
import Header from "../component/Header";
import {Container} from "@mui/material";
import 'lightbox.js-react/dist/index.css'


const Layout = () => {
    return (
        <>
            <Header />
            <Container sx={{padding: "24px"}}>
                <Outlet />
            </Container>

        </>
    )
}

export default Layout;