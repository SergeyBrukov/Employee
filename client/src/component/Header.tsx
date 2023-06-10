import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {makeStyles} from "tss-react/mui";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {useNavigate} from "react-router-dom";
import {Logout} from "../features/userSlice";


const useStyleHeader = makeStyles()({
    headerContainer: {
        background: "#0E0E0B"
    }
})

const Header = () => {

    const {classes} = useStyleHeader()

    const navigation = useNavigate();

    const {token} = useAppSelector(store => store.userSlice);
    const dispatch = useAppDispatch()

    const handleLogout = () => {
        dispatch(Logout());
        navigation("/login");
    }

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static" className={classes.headerContainer}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1, cursor: "pointer"}} onClick={() => navigation("/")}>
                        Employees
                    </Typography>
                    {token ? <Button color="inherit" onClick={handleLogout}>Logout</Button> :
                        <Button color="inherit" onClick={() => navigation("/login")}>Login</Button>}
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Header