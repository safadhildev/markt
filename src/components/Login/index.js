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
  },
  registerButton: {
    margin: "10px 0",
    fontSize: "16px",
  },
}));

const Login = ({ message, severity, setOpen }) => {
  const classes = useStyles();
  const history = useHistory();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      if (userCredential) {
        setLoading(false);
        severity("success");
        message("Login Successful!");
        setOpen(true);
        setTimeout(() => {
          history.push("/home");
        }, 1000);
      }
    } catch (error) {
      severity("error");
      message(`Error: ${error.message}`);
      setOpen(true);
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
          disabled={!email || !password || loading}
          endIcon={
            loading && (
              <CircularProgress style={{ color: "#FFF" }} size="smaill" />
            )
          }
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
        <Button
          color="primary"
          onClick={() => onRegister()}
          className={classes.registerButton}
        >
          Register
        </Button>
      </Grid>
    </Grid>
  );
};

export default Login;
