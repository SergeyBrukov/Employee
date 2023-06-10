import React, {ChangeEvent, FC, useRef} from "react";
import {TFile} from "../utils/type";
import Modal from '@mui/material/Modal';
import {ImageList, ImageListItem} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import Box from "@mui/material/Box";
import {makeStyles} from "tss-react/mui";
import IconButton from "@mui/material/IconButton";
import {fileReader} from "../utils/customFunk";

interface IFileModalList {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    fileList: TFile[],
    deleteFile: (id: string) => void,
    changeFile: (id: string, file: Omit<TFile, "id">) => void
}
const StyleFileModalList = makeStyles()({
    modalFileWrapper: {
        padding: "15px",
        maxWidth: "800px",
        maxHeight: "600px",
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: "#FFFFFF"
    },
    fileListContainer: {},
    fileItemActiveGroup: {
        display: "flex",
        gap: "10px",
        position: "absolute",
        top: "5px",
        right: "5px"
    }
})

const FileModalList: FC<IFileModalList> = ({fileList, setVisible, visible, deleteFile, changeFile}) => {

    const {classes} = StyleFileModalList();

    const refChangeFile = useRef<any>({});

    const handleChangeFile = async (e: ChangeEvent<HTMLInputElement>, id: string) => {
        if (!e.target.files) {
            return;
        }

        const file = e.target.files[0];

        const newFile = {
            name: file.name,
            type: file.name.split(".").pop(),
            base64: await fileReader(file)
        };

        changeFile(id, newFile as Omit<TFile, "id">);

    }

    return (
        <Modal
            open={visible}
            onClose={() => setVisible(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box className={classes.modalFileWrapper}>
                <ImageList className={classes.fileListContainer} sx={{width: 500, height: 450}} cols={3}
                           rowHeight={164}>
                    {fileList.map((item, index) => (
                        <ImageListItem key={item.id} sx={{position: "relative"}}>
                            <input ref={ref => {
                                if(ref) {
                                    refChangeFile.current[item.id] = ref
                                }

                            }} type="file" onChange={(e) => handleChangeFile(e, item.id)}  style={{display: "none"}}/>

                            <Box className={classes.fileItemActiveGroup}>
                                <IconButton aria-label="change" sx={{
                                    background: "#0E0E0B", transition: "all 0.3s ease", ":hover": {
                                        background: "#0E0E0B",
                                        transform: "scale(1.1)"
                                    }
                                }} onClick={() => {
                                    if (refChangeFile.current) {
                                        refChangeFile.current[item.id].click();
                                    }
                                }}>
                                    <ChangeCircleIcon sx={{color: "#DAEE01"}}/>
                                </IconButton>
                                <IconButton aria-label="delete" sx={{
                                    background: "#0E0E0B", transition: "all 0.3s ease", ":hover": {
                                        background: "#0E0E0B",
                                        transform: "scale(1.1)"
                                    }
                                }} onClick={() => deleteFile(item.id)}>
                                    <DeleteIcon sx={{color: "#FFFFFF"}}/>
                                </IconButton>
                            </Box>
                            <img
                                src={item.base64}
                                alt={item.name}
                                loading="lazy"
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </Box>
        </Modal>
    )
}

export default FileModalList;