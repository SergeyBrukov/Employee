import React, {FC, useEffect} from "react";
import Box from "@mui/material/Box";
import {makeStyles} from "tss-react/mui";

interface IContextMessageMenu {
    positionContextMenu: {
        y: number,
        x: number
    }
    visibleContextMenu: boolean
    setVisibleContextMenu: (open: boolean) => void
}

const StyledContextMessageMenu = makeStyles()({
    contextMenuContainer: {
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        background: "#FFFFFF",
        boxShadow: "2px 6px 37px 6px rgba(0,0,0,0.55)",
        zIndex: "100"
    },
    contextMenuItem: {
        padding: "10px",
        transition: "all 0.3s ease",
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "#0E0E0B",
            color: "#FFFFFF",
        }
    }
})

const ContextMessageMenu: FC<IContextMessageMenu> = ({
                                                         positionContextMenu,
                                                         setVisibleContextMenu,
                                                         visibleContextMenu
                                                     }) => {

    const {classes} = StyledContextMessageMenu();

    useEffect(() => {
        const handleClick = () => {
            if (visibleContextMenu) {
                setVisibleContextMenu(false);
            }
        }

        document.addEventListener("click", handleClick);

        return () => document.removeEventListener("click", handleClick)

    }, [])

    return (
        <Box
            className={classes.contextMenuContainer}
            sx={{position: 'fixed', top: positionContextMenu.y, left: positionContextMenu.x}}
            onClick={() => setVisibleContextMenu(false)}
        >
            <Box className={classes.contextMenuItem}>Елемент меню 1</Box>
            <Box className={classes.contextMenuItem}>Елемент меню 2</Box>
            <Box className={classes.contextMenuItem}>Елемент меню 3</Box>
        </Box>
    )
}

export default ContextMessageMenu