import React from 'react';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";

const DialogConfig = ({children, open, handleClose, title}) => {
    return (
        <Dialog open={open} onClose={handleClose} animation={"false"}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary" autoFocus>
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogConfig;