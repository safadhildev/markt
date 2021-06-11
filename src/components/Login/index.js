import {
  Button,
  CircularProgress,
  Grid,
  makeStyles,
  Snackbar,
  TextField,
} from "@material-ui/core";
import React, { useState } from "react";
import { useHistory } from "react-router";
import "./index.css";
import MuiAlert from "@material-ui/lab/Alert";
import firebase from "firebase/app";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
  },
  input: {
    margin: "20px 0",
  },
  button: {
    margin: "50px 0",
    padding: "10px 0",
    fontSize: "18px",
    fontWeight: "bold",
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Login = () => {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      console.log(userCredential.user);

      if (userCredential) {
        setLoading(false);
        setOpen(true);
        setTimeout(() => {
          history.push("/home");
        }, 500);
      }
    } catch (error) {
      setLoading(false);
      console.log("Login - onLogin :: ", error);
    }
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
    </Grid>
  );
};

export default Login;
