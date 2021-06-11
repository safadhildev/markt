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

const PrivateRoute = ({ component: Component, authenticated, path, exact }) => {
  return (
    <Route
      path={path}
      exact={exact}
      render={(props) =>
        authenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

const App = () => {
  const [authentication, setAuthState] = useState({
    authenticated: false,
  });

  useEffect(
    () =>
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log({ user });
          setAuthState({
            authenticated: true,
          });
        } else {
          setAuthState({
            authenticated: false,
          });
        }
      }),
    [setAuthState]
  );

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {authentication.authenticated ? <Redirect to="/home" /> : <Login />}
        </Route>
        <Route exact path="/Register">
          <Register />
        </Route>
        <Route exact path="/home">
          {authentication.authenticated ? <Home /> : <Redirect to="/" />}
        </Route>
        <Route exact path="/profile">
          {authentication.authenticated ? <Profile /> : <Redirect to="/" />}
        </Route>
        <Route exact path="/likes">
          {authentication.authenticated ? <Likes /> : <Redirect to="/" />}
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
