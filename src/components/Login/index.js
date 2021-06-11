import {
  Button,
  CircularProgress,
  Grid,
  makeStyles,
  TextField,
} from "@material-ui/core";
import React, { useState } from "react";
import { useHistory } from "react-router";
import "./index.css";

import firebase from "firebase/app";
import MySnackbar from "../common/MySnackbar";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
  },
  input: {
    margin: "20px 0",
  },
  button: {
    margin: "50px 0 0 0",
    padding: "10px 0",
    fontSize: "18px",
    fontWeight: "bold",
  },
  registerButton: {
    margin: "10px 0",
    fontSize: "16px",
    fontWeight: "500",
  },
}));

const Login = () => {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [message, setMessage] = useState("");

  const onLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      if (userCredential) {
        setLoading(false);
        setSeverity("success");
        setMessage("Login Successful!");
        setOpen(true);
        setTimeout(() => {
          history.push("/home");
        }, 1000);
      }
    } catch (error) {
      setLoading(false);
      console.log("Login - onLogin :: ", error);
    }
  };

  const onRegister = () => {
    history.push("/register");
  };

  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };

  console.log({ email });

  return (
    <Grid
      container
      xs={12}
      alignItems="center"
      justify="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid container xs={5} direction="column">
        <TextField
          variant="outlined"
          type="email"
          autoComplete
          onChange={onChangeEmail}
          value={email}
          label="Email"
          className={classes.input}
          fullWidth
        />
        <TextField
          variant="outlined"
          type="password"
          autoComplete
          onChange={onChangePassword}
          value={password}
          label="Password"
          className={classes.input}
          fullWidth
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => onLogin()}
          className={classes.button}
          disabled={!email || !password}
          endIcon={
            loading && (
              <CircularProgress style={{ color: "#FFF" }} size="smaill" />
            )
          }
        >
          Login
        </Button>
        <Button
          color="primary"
          onClick={() => onRegister()}
          className={classes.registerButton}
        >
          Register
        </Button>
        <MySnackbar
          severity={severity}
          message={message}
          open={open}
          onClose={() => {
            setOpen(false);
          }}
        />
      </Grid>
    </Grid>
  );
};

export default Login;
