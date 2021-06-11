import React from "react";
import MuiAlert from "@material-ui/lab/Alert";
import { Snackbar } from "@material-ui/core";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const MySnackbar = ({ onClose, open, severity, message }) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      open={open}
      autoHideDuration={1000}
      onClose={onClose}
    >
      <Alert severity={severity}>{message}</Alert>
    </Snackbar>
  );
};

export default MySnackbar;
