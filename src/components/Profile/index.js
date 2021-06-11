import { Grid, makeStyles } from "@material-ui/core";
import React from "react";
import Navbar from "../common/Navbar";
import "./index.css";
import firebase from "firebase/app";
import "firebase/firestore";

const useStyle = makeStyles((theme) => ({
  root: {
    margin: "80px 0",
  },
  img: {
    height: 255,
    display: "block",
    maxWidth: 400,
    overflow: "hidden",
    width: "100%",
  },
  stepper: { maxWidth: 400 },
  searchButton: { width: "auto", backgroundColor: "#FFF", padding: "0px 10px" },
}));

const Profile = () => {
  const classes = useStyle();
  const db = firebase.firestore();
  return (
    <Grid
      container
      xs={12}
      className={classes.root}
      direction="row"
      justify="center"
      alignItems="center"
    >
      <Navbar />
    </Grid>
  );
};

export default Profile;
