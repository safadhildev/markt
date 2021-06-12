import React, { useContext, createContext, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect,
} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import "./firebase";
import firebase from "firebase/app";
import Navbar from "./components/common/Navbar";
import Profile from "./components/Profile";
import "./App.css";
import "firebase/auth";
import Register from "./components/Register";
import Likes from "./components/Likes";
import MySnackbar from "./components/common/MySnackbar";
import Template from "./components/Template";

const App = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(
    () =>
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log({ user });
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      }),
    [setIsAuth]
  );

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {isAuth ? (
            <Redirect to="/home" />
          ) : (
            <Login
              setOpen={setOpen}
              severity={setSeverity}
              message={setMessage}
            />
          )}
        </Route>
        <Route exact path="/register">
          <Register
            setOpen={setOpen}
            severity={setSeverity}
            message={setMessage}
          />
        </Route>
        <Route exact path="/template">
          <Template />
        </Route>
        <Route exact path="/home">
          {isAuth ? <Home /> : <Redirect to="/" />}
        </Route>
        <Route exact path="/profile">
          {isAuth ? (
            <Profile
              setOpen={setOpen}
              severity={setSeverity}
              message={setMessage}
            />
          ) : (
            <Redirect to="/" />
          )}
        </Route>
        <Route exact path="/likes">
          {isAuth ? <Likes /> : <Redirect to="/" />}
        </Route>
      </Switch>
      <MySnackbar
        severity={severity}
        message={message}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      />
    </Router>
  );
};

export default App;
