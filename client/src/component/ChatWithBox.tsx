import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import Box from "@mui/material/Box";
import Textarea from '@mui/joy/Textarea';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send'
import IconButton from '@mui/material/IconButton';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MovieIcon from '@mui/icons-material/Movie';
import Badge from '@mui/material/Badge';
import {makeStyles} from "tss-react/mui";
import Message from "./Message";
import {fileReader} from "../utils/customFunk";
import {TFile} from "../utils/type";
import FileModalList from "./FileModalList";
import jwtDecode from "jwt-decode";
import moment from "moment";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {addNewMessageByChat, getMessagesByChat, sendMessage} from "../features/chatWithBosSlice";
import {MayRole} from "../utils/interface";
import {useParams} from "react-router-dom";
import {socket} from "../utils/socket";
import {date} from "yup";


const StyledChaWithBos = makeStyles()({
    chatWithBosWrapper: {
        margin: "50px auto 0",
        padding: "50px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "15px",
        background: "#0E0E0B",
        borderRadius: "12px"
    },
    chatContainer: {
        padding: "25px",
        width: "100%",
        height: "500px",
        display: "flex",
        flexDirection: "column-reverse",
        gap: "15px",
        background: "#FFFFFF",
        overflowX: "auto"
    },
    chatSendBlock: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
        width: "100%",
        ".Mui-disabled": {
            backgroundColor: "#FFFFFF !important"
        }
    }
})

const ChatWithBos = () => {

    const {classes} = StyledChaWithBos();


    const dispatch = useAppDispatch();
    const {loading, messages} = useAppSelector(store => store.chatWithBosSlice);
    const {role} = useAppSelector(store => store.userSlice);
    const {id} = useParams();

    //@ts-ignore
    const chatIdByEmployee = role === MayRole.OWNER ? id : jwtDecode(localStorage.getItem("userToken")).userId;


    const refInputFile = useRef<HTMLInputElement | null>(null);



    const [messageValue, setMessageValue] = useState<string>("");
    const [messageFiles, setMessageFiles] = useState<TFile[]>([]);
    const [visibleModalFiles, setVisibleModalFiles] = useState<boolean>(false);
    const countFileRef = useRef<number>(messageFiles.length);

    const handleSendMessage = () => {

        const createMessageObject = {
            //@ts-ignore
            chatIdByEmployee,
            date: moment().valueOf(),
            messageValue,
            messageFiles,
            replaceMessageId: null
        }

        dispatch(sendMessage(createMessageObject)).then((response:any) => {
            if(response.payload.status === 201) {
                setMessageValue("");
                setMessageFiles([]);
                socket.emit("new-message", {roomId: chatIdByEmployee, message: response.payload.message})
            }
        });
    }

    const handleAddFileOrPhoto = async (e: ChangeEvent<HTMLInputElement>) => {

        if (!e.target.files) {
            return;
        }

        // @ts-ignore
        const files = [...e.target.files];
        let counter = messageFiles.length;

        const arrayFilesWithBase64Format = files.map(async (file, index) => {

            return {
                id: ++counter,
                name: file.name,
                type: file.name.split(".").pop(),
                base64: await fileReader(file)
            }
        })

        const promiseFileResult = await Promise.all(arrayFilesWithBase64Format);

        countFileRef.current = countFileRef.current + promiseFileResult.length;

        //@ts-ignore
        setMessageFiles(prev => [...prev, ...promiseFileResult]);

    }


    const deleteFileByMessage = (id: string) => {
        setMessageFiles(prev => prev.filter(item => item.id !== id));

        countFileRef.current -= 1;

        if (countFileRef.current === 0) {
            setVisibleModalFiles(false);
        }
    }

    const changeFileByMessage = (id: string, file: Omit<TFile, "id">) => {

        setMessageFiles(prev => prev.map(item => {
            if (item.id === id) {
                return {
                    id: item.id,
                    ...file
                }
            }
            return item;
        }))
    }

    useEffect(() => {

        dispatch(getMessagesByChat(chatIdByEmployee))

        socket.emit("join-chat", chatIdByEmployee);

        socket.on("receive-new-message", (data) => {
            dispatch(addNewMessageByChat(data.message))
        })

        return () => {
            socket.emit("leave-room-chat", chatIdByEmployee)
            socket.off('receive-new-message');
        }

    }, [])

    // useEffect(() => {
    //     const downloadElementLink = document.createElement("a");
    //     downloadElementLink.className = "download-link";
    //     document.body.appendChild(downloadElementLink);
    // }, [])

    const downloadRefLink = useRef<HTMLAnchorElement>(null)

    return (
        <Box className={classes.chatWithBosWrapper}>
            <a ref={downloadRefLink}/>
            <FileModalList visible={visibleModalFiles} setVisible={setVisibleModalFiles} fileList={messageFiles}
                           deleteFile={deleteFileByMessage} changeFile={changeFileByMessage}/>

            <input type="file" onChange={handleAddFileOrPhoto} style={{display: "none"}} ref={refInputFile}
                   multiple={true}/>
            <Box className={classes.chatContainer}>
                {messages.map((mess, index) => (
                    <Message message={mess} key={index} downloadRefLink={downloadRefLink}/>
                ))}
            </Box>
            <Box className={classes.chatSendBlock}>
                <Textarea sx={{width: "100%"}} minRows={2} value={messageValue}
                          onChange={(e) => setMessageValue(e.target.value)}/>
                {messageFiles.length > 0 &&
                    <Badge color="primary" sx={{cursor: "pointer"}} badgeContent={messageFiles.length}
                           onClick={() => setVisibleModalFiles(true)}>
                        <MovieIcon sx={{color: "#FFFFFF"}}/>
                    </Badge>}
                <IconButton color="primary" aria-label="add to shopping cart" onClick={() => {
                    if (refInputFile.current) {
                        refInputFile.current.click()
                    }
                }}>
                    <AttachFileIcon sx={{color: "#FFFFFF"}}/>
                </IconButton>
                <Button onClick={handleSendMessage} variant="contained" endIcon={<SendIcon/>}
                        sx={{background: "#FFFFFF", color: "#0E0E0B"}}
                        disabled={messageValue.length === 0 && countFileRef.current === 0}>
                    Send
                </Button>
            </Box>
        </Box>
    )
}

export default ChatWithBos