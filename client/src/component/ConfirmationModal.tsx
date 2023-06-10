import React, {FC} from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {IConfirmationModal} from "../utils/interface";
import Button from "@mui/material/Button";
import {makeStyles} from "tss-react/mui";
import LoadingButton from "@mui/lab/LoadingButton";


const styleConfirmationModal = makeStyles()({
   confirmationModalContainer: {
       padding: "25px",
       position: 'absolute',
       top: '50%',
       left: '50%',
       transform: 'translate(-50%, -50%)',
       width: 400,
       backgroundColor: '#FFFFFF',
   },
    confirmationModalActionBlock: {
       paddingTop: "20px",
      display: "flex",
      alignItems: "center",
        justifyContent: "end",
      gap: "15px"

    }
})

const ConfirmationModal:FC<IConfirmationModal> = ({open, setOpen, handler, title = "Confirmation modal", description, loading}) => {

    const {classes} = styleConfirmationModal();

    const handleClose = () => setOpen(false);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={classes.confirmationModalContainer}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {title}
                </Typography>
                <Typography id="modal-modal-description" sx={{mt: 2}}>
                    {description}
                </Typography>
                <Box className={classes.confirmationModalActionBlock}>
                    {loading ? <LoadingButton loading variant="outlined">
                        Submit
                    </LoadingButton> : <Button variant="outlined" color="success" onClick={handler}>Yes</Button>}
                    <Button variant="outlined" color="error" onClick={handleClose}>No</Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default ConfirmationModal;