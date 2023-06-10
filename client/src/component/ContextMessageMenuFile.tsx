import React, {FC, MouseEvent, useEffect} from "react";
import Box from "@mui/material/Box";
import {makeStyles} from "tss-react/mui";

interface IContextMessageMenuFile {
    positionContextMenuFile: {
        y: number,
        x: number
    }
    visibleContextMenuFile: boolean
    setVisibleContextMenuFile: (open: boolean) => void,
    downloadRefLink: any
    refLinkDownloadImage: any
}

const StyledContextMessageMenuFile = makeStyles()({
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

const ContextMessageMenuFile: FC<IContextMessageMenuFile> = ({
                                                                 positionContextMenuFile,
                                                                 setVisibleContextMenuFile,
                                                                 visibleContextMenuFile,
                                                                 downloadRefLink,
                                                                 refLinkDownloadImage
                                                             }) => {

    const {classes} = StyledContextMessageMenuFile();

    useEffect(() => {
        const handleClick = () => {
            if (visibleContextMenuFile) {
                setVisibleContextMenuFile(false);
            }
        }

        document.addEventListener("click", handleClick);

        return () => document.removeEventListener("click", handleClick);

    }, [])

    const handleDownloadClick = (e: MouseEvent<HTMLDivElement>) => {
        downloadRefLink.current.href = refLinkDownloadImage.current;
        downloadRefLink.current.download = true;
        downloadRefLink.current.click();
    }

    return (
        <Box
            className={classes.contextMenuContainer}
            sx={{position: 'fixed', top: positionContextMenuFile.y, left: positionContextMenuFile.x}}
            onClick={() => setVisibleContextMenuFile(false)}
        >
            <Box className={classes.contextMenuItem} onClick={handleDownloadClick}>Download</Box>
        </Box>
    )
}

export default ContextMessageMenuFile