import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { Button, Grid, makeStyles, TextField } from "@material-ui/core";
import { useHistory } from "react-router";
import MySnackbar from "../common/MySnackbar";

const useStyle = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
  },
  input: {
    margin: "20px 0",
  },
}));

const Register = ({ severity, setOpen, message }) => {
  const classes = useStyle();
  const history = useHistory();
  const db = firebase.firestore().collection("users");
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);

  const onLogin = () => {
    history.push("/");
  };

  const onRegister = async () => {
    setLoading(true);
    try {
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      if (userCredential) {
        const userData = {
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          image: userCredential.user.photoURL,
          likes: [],
        };
        await db.doc(userCredential.user.uid).set(userData);
        setLoading(false);
        severity("success");
        message("Registration Successful!");
        setOpen(true);
        await firebase.auth().signOut();
        history.push("/");
      }
    } catch (error) {
      severity("error");
      message(`Error: ${error.message}`);
      setOpen(true);
      setLoading(false);
      console.log("onRegister :: ", error);
    }
  };

  const onValidate = () => {
    if (!email || !password) {
      alert("Please fill all fields");
    }
    if ((email && !email.includes("@")) || !email.includes(".")) {
      alert("Please enter a valid email");
    } else {
      onRegister();
    }
  };

  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };
  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };

  return (
    <Grid
      container
      xs={12}
      justify="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid container xs={5}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            type="email"
            label="Email"
            value={email}
            onChange={onChangeEmail}
            className={classes.input}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            type="password"
            label="Password"
            value={password}
            onChange={onChangePassword}
            className={classes.input}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              onValidate();
            }}
            color="primary"
            className={classes.input}
            size="large"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth color="primary" onClick={() => onLogin()}>
            Login
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Register;
