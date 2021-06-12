import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Navbar from "../common/Navbar";
import "./index.css";
import firebase from "firebase/app";
import "firebase/firestore";
import placeholder from "../../assets/profile-placeholder.png";
import { Close } from "@material-ui/icons";

const useStyle = makeStyles((theme) => ({
  root: {
    margin: "80px 0",
  },
  body: {
    margin: "0px 0",
  },
  img: {
    height: 255,
    display: "block",
    maxWidth: 400,
    overflow: "hidden",
    width: "100%",
  },
  input: { margin: "20px 0" },
  title: {
    fontWeight: "bold",
    fontSize: "24px",
    margin: "30px 0",
  },
  updateImgButton: {
    width: "200px",
    color: "#FFF",
    margin: "10px 0",
    backgroundColor: "#2196F3",
    textTransform: "uppercase",
    fontSize: "14px",
    textAlign: "center",
    padding: "13px 0",
    borderRadius: "5px",
    boxShadow:
      "0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.20)",
  },
  deleteImgButton: {
    width: "200px",
    color: "#FFF",
    backgroundColor: "#f44336",
    margin: "10px 0",
    fontSize: "14px",
  },
}));

const Profile = ({ setOpen, severity, message }) => {
  const currentUser = firebase.auth().currentUser;
  const classes = useStyle();
  const db = firebase.firestore();
  const storageRef = firebase.storage().ref();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tempImg, setTempImg] = useState(null);

  const getUserData = (doc) => {
    try {
      setUserData(doc.data());
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error :: ", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = db
      .collection("users")
      .doc(currentUser.uid)
      .onSnapshot((doc) => {
        getUserData(doc);
      });
    return unsubscribe;
  }, []);

  const uploadWithImage = async () => {
    try {
      await storageRef
        .child(`users/${currentUser.uid}/${tempImg.file.name}`)
        .put(tempImg.file);
      const downloadUrl = await storageRef
        .child(`users/${currentUser.uid}/${tempImg.file.name}`)
        .getDownloadURL();
      await db
        .collection("users")
        .doc(currentUser.uid)
        .update({
          ...userData,
          image: downloadUrl,
        });
      setOpen(true);
      severity("success");
      message("Update Successful!");
    } catch (error) {
      setOpen(true);
      severity("error");
      message(error.message);
      console.log("Error :: ", error);
    }
  };

  console.log(currentUser.uid);

  const uploadWithoutImage = async () => {
    try {
      await db
        .collection("users")
        .doc(currentUser.uid)
        .update({
          ...userData,
        });
      setOpen(true);
      severity("success");
      message("Update Successful!");
    } catch (error) {
      setOpen(true);
      severity("error");
      message(error.message);
      console.log("Error :: ", error);
    }
  };
  const onUpdateUser = async () => {
    if (tempImg) {
      uploadWithImage();
    } else {
      uploadWithoutImage();
    }
  };

  const onDeleteImage = () => {
    if (tempImg) {
      setTempImg(null);
    } else if (userData.image) {
      // delete image from storage
    }
  };

  const onChangeText = (value, type) => {
    setUserData({
      ...userData,
      [type]: value,
    });
  };

  const onChangeImage = (input) => {
    console.log("INPUT :: ", input);
    if (input.target.files && input.target.files[0]) {
      console.log(input.target.files[0]);
      const reader = new FileReader();
      reader.onload = function (event) {
        setTempImg({ path: event.target.result, file: input.target.files[0] });
      };
      reader.readAsDataURL(input.target.files[0]);
    }
  };

  const renderData = () => {
    return (
      <Grid
        container
        xs={12}
        justify="center"
        spacing={4}
        className={classes.body}
      >
        <Grid container xs={12} md={5} justify="center">
          <Typography className={classes.title}>Profile</Typography>

          <Grid container xs={12} justify="center">
            <div className="image-wrapper">
              <img
                id="img"
                src={
                  tempImg?.path ? tempImg?.path : userData?.image ?? placeholder
                }
                alt={placeholder}
              />
            </div>
          </Grid>
          <Grid container xs={10}>
            <Grid container xs={12} sm={6} justify="center">
              <label for="imgSelect" class={classes.updateImgButton}>
                Select Image
              </label>
              <input
                id="imgSelect"
                className={classes.updateImgButton}
                type="file"
                accept="image/png, image/jpeg"
                hidden
                onChange={(input) => {
                  onChangeImage(input);
                }}
              />
            </Grid>
            <Grid container xs={12} sm={6} justify="center">
              <Button
                variant="contained"
                size="large"
                classes={{ root: classes.deleteImgButton, focusVisible: false }}
                onClick={() => onDeleteImage()}
                disableRipple
              >
                {tempImg ? "Remove" : "Delete"} Image
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={10}>
            <TextField
              fullWidth
              className={classes.input}
              variant="outlined"
              value={userData?.displayName}
              label="Name"
              onChange={(event) =>
                onChangeText(event.target.value, "displayName")
              }
              InputLabelProps={{
                shrink: userData?.displayName && true,
              }}
            />
          </Grid>
          <Grid item xs={10}>
            <TextField
              fullWidth
              className={classes.input}
              variant="outlined"
              value={userData?.email}
              label="Email"
              disabled
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={10}>
            <TextField
              fullWidth
              className={classes.input}
              variant="outlined"
              value={userData?.phone}
              label="Phone"
              onChange={(event) => onChangeText(event.target.value, "phone")}
              InputLabelProps={{
                shrink: userData?.phone && true,
              }}
            />
          </Grid>
          <Grid item xs={10} style={{ marginTop: "50px" }}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              color="primary"
              onClick={() => {
                onUpdateUser();
              }}
            >
              Update
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const renderLoading = () => {
    return (
      <Grid container xs={12} justify="center" className={classes.body}>
        <CircularProgress />
      </Grid>
    );
  };
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
      {loading ? renderLoading() : renderData()}
    </Grid>
  );
};

export default Profile;
