import React, {MouseEvent, useEffect, useRef, useState} from "react"
import Box from "@mui/material/Box";
import {makeStyles} from "tss-react/mui";
import Typography from "@mui/material/Typography";
import DraftsIcon from '@mui/icons-material/Drafts';
import {useAppSelector} from "../app/hooks";
import {TMessage} from "../utils/type";
import moment from "moment";
import {SlideshowLightbox} from 'lightbox.js-react'

// @ts-ignore
import ModalImage from 'react-modal-image';
import ContextMessageMenu from "./ContextMessageMenu";
import ContextMessageMenuFile from "./ContextMessageMenuFile";

const StyleMessage = makeStyles()({
    messageWrapper: {
        display: "flex",
        flexDirection: "column"
    },
    messageContainer: {
        padding: "20px",
        maxWidth: "330px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        borderRadius: "7px"
    },
    topBlockMessage: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px"
    },
    imageBlockLibrary: {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        "img": {
            width: "150px",
            height: "150px",
            borderRadius: "7px"
        }
    }
})

const Message = ({message, downloadRefLink}: { message: TMessage, downloadRefLink: any }) => {
    const {classes} = StyleMessage();

    const [visibleContextMenu, setVisibleContextMenu] = useState<boolean>(false);
    const [positionContextMenu, setPositionContextMenu] = useState({x: 0, y: 0});


    const [visibleContextMenuFile, setVisibleContextMenuFile] = useState<boolean>(false);
    const [positionContextMenuFile, setPositionContextMenuFile] = useState({x: 0, y: 0});


    const {messageFiles, messageValue, date, replaceMessageId, authorName, id} = message;

    const {name} = useAppSelector(store => store.userSlice)

    const examinationUser = authorName === name;

    const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();

        setVisibleContextMenu(true);
        setPositionContextMenu({x: e.pageX, y: e.pageY})
    }

    const refLinkDownloadImage = useRef<string | null>(null);

    const handleContextMenuImage = (e: MouseEvent, image: string) => {
        e.preventDefault();
        e.stopPropagation();
        setVisibleContextMenuFile(true);
        setPositionContextMenuFile({x: e.pageX, y: e.pageY});


        refLinkDownloadImage.current = image
    }

    return (
        <Box className={classes.messageWrapper} sx={{alignItems: examinationUser ? "end" : "start"}}>

            {visibleContextMenu && <ContextMessageMenu
                positionContextMenu={positionContextMenu}
                visibleContextMenu={visibleContextMenu}
                setVisibleContextMenu={setVisibleContextMenu}/>}

            {visibleContextMenuFile && <ContextMessageMenuFile
                downloadRefLink={downloadRefLink}
                positionContextMenuFile={positionContextMenuFile}
                visibleContextMenuFile={visibleContextMenuFile}
                setVisibleContextMenuFile={setVisibleContextMenuFile}
                refLinkDownloadImage={refLinkDownloadImage}
            />}

            <Box onContextMenu={handleContextMenu} className={classes.messageContainer}
                 sx={{background: examinationUser ? "green" : "red"}}>
                <Box className={classes.topBlockMessage}>
                    <Typography>
                        {authorName}
                    </Typography>
                    <DraftsIcon/>
                </Box>
                <Typography>
                    {messageValue}
                </Typography>
                {messageFiles && messageFiles.length > 0 && <SlideshowLightbox className={classes.imageBlockLibrary}>
                    {messageFiles.map(image => (
                        <img className="w-full rounded" src={image.base64} alt={image.name}
                             onContextMenu={(e) => handleContextMenuImage(e, image.base64)}/>
                    ))}
                </SlideshowLightbox>}

            </Box>
            <Typography>
                {moment(Number(date)).format("HH:mm")}
            </Typography>
        </Box>
    )
}

export default Message;