import { Button, Grid, makeStyles, Snackbar } from "@material-ui/core";
import React, { useState } from "react";
import { useHistory } from "react-router";
import "./index.css";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Login = () => {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);

  const onLogin = () => {
    setOpen(true);
    setTimeout(() => {
      history.push("/home");
    }, 1000);
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: "100vh" }}
    >
      <Button variant="contained" color="primary" onClick={() => onLogin()}>
        Login
      </Button>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={open}
        autoHideDuration={1000}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Alert severity="success">This is a success message!</Alert>
      </Snackbar>
    </Grid>
  );
};

export default Login;
