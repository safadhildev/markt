import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import {
  CircularProgress,
  Grid,
  IconButton,
  makeStyles,
  TextField,
  useMediaQuery,
  Typography,
  Button,
  Select,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import placeholder from "../../../assets/profile-placeholder.png";
import Navbar from "../../common/Navbar";
import { useHistory, useParams } from "react-router-dom";

const useStyle = makeStyles((theme) => ({
  root: {
    margin: "100px 0",
  },
  body: {
    padding: "0 0 100px 0",
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
    "&:hover": {
      backgroundColor: "#0D47A1",
    },
  },
  deleteImgButton: {
    width: "200px",
    color: "#FFF",
    backgroundColor: "#f44336",
    margin: "10px 0",
    fontSize: "14px",
  },
  disabledButton: {
    backgroundColor: "#e0e0e0",
    width: "200px",
    color: "#a6a6a6",
    margin: "10px 0",
    textTransform: "uppercase",
    fontSize: "14px",
    textAlign: "center",
    padding: "13px 0",
    borderRadius: "5px",
  },
}));

const UploadPost = ({ setOpen, severity, message }) => {
  const currentUser = firebase.auth().currentUser;
  const history = useHistory();
  const { id } = useParams();
  const classes = useStyle();
  const db = firebase.firestore();
  const storageRef = firebase.storage().ref();
  const [tempImg, setTempImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [createPostData, setCreatePostData] = useState({
    name: "",
    phone: "",
    brand: "",
    price: "",
    condition: "",
    category: "",
    description: "",
  });

  const getPostData = async () => {
    setLoading(true);
    try {
      const doc = await db.collection("post").doc(id).get();
      if (doc.exists) {
        setCreatePostData({
          ...doc.data(),
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("getPostData ::", error);
    }
  };

  const onUpdatePost = async (imgUrl) => {
    setLoading(true);
    try {
      await db
        .collection("post")
        .doc(id)
        .update({
          ...createPostData,
          image: imgUrl,
        });
      setOpen(true);
      severity("success");
      message("Update Successful!");
      setCreatePostData({
        name: "",
        phone: "",
        brand: "",
        price: "",
        condition: "",
        category: "",
        description: "",
      });
      setLoading(false);
      history.goBack();
    } catch (error) {
      setLoading(false);
      setOpen(true);
      severity("error");
      message(error.message);
      console.log("onUpdatePost :: ", error);
    }
  };

  const uploadNewPost = async () => {
    setLoading(true);
    try {
      const key = Math.round(+new Date() / 1000);
      await storageRef
        .child(`post/${key}/${tempImg.file.name}`)
        .put(tempImg.file);
      const downloadUrl = await storageRef
        .child(`post/${key}/${tempImg.file.name}`)
        .getDownloadURL();
      await db
        .collection("post")
        .doc(key.toString())
        .set({
          ...createPostData,
          email: currentUser.email,
          image: downloadUrl,
        });
      setOpen(true);
      severity("success");
      message("Upload Successful!");
      setCreatePostData({
        name: "",
        phone: "",
        brand: "",
        price: "",
        condition: "",
        category: "",
        description: "",
      });
      setLoading(false);
      setTempImg(null);
      history.goBack();
    } catch (error) {
      setLoading(false);
      setOpen(true);
      severity("error");
      message(error.message);
      console.log("Error :: ", error);
    }
  };

  // function to add item into listing sell
  const onValidate = () => {
    const { name, brand, price, condition, category, phone, description } =
      createPostData;

    console.log("onValidate :: image => ", createPostData.image);
    console.log("onValidate :: tempImg => ", tempImg);

    if (
      (tempImg === null && !createPostData.image) ||
      name === "" ||
      brand === "" ||
      price === "" ||
      condition === "" ||
      category === "" ||
      phone === "" ||
      description === ""
    ) {
      alert("field cannot be empty");
    } else if (editMode && !tempImg) {
      console.log("Update without image changed");
      onUpdatePost(createPostData.image);
    } else if (editMode && tempImg !== createPostData.image) {
      console.log("Update with image changed");
      onDeleteImageFromStorage();
    } else {
      console.log("upload new post");
      uploadNewPost();
    }
  };

  const onDeleteImageFromStorage = async () => {
    try {
      await firebase.storage().refFromURL(createPostData.image).delete();
      await storageRef
        .child(`post/${id}/${tempImg.file.name}`)
        .put(tempImg.file);
      const downloadUrl = await storageRef
        .child(`post/${id}/${tempImg.file.name}`)
        .getDownloadURL();
      onUpdatePost(downloadUrl);
    } catch (error) {
      setOpen(true);
      severity("error");
      message(error.message);
    }
  };

  const onRemoveImage = () => {
    if (tempImg) {
      setTempImg(null);
    }
  };

  const onChangeText = (value, type) => {
    setCreatePostData({
      ...createPostData,
      [type]: value,
    });
  };

  const onChangeImage = (input) => {
    console.log("INPUT :: ", input);
    if (input.target.files && input.target.files[0]) {
      console.log(input.target.files[0]);
      console.log("FILE NAME :: ", input.target.files[0].name);
      console.log("FILE NAME :: ", input.target.files[0].type);
      const reader = new FileReader();
      reader.onload = function (event) {
        setTempImg({ path: event.target.result, file: input.target.files[0] });
      };
      reader.readAsDataURL(input.target.files[0]);
    }
  };

  const handleChange = (event) => {
    const name = event.target.value;
    setCreatePostData({ ...createPostData, condition: name });
  };

  const handleChangeCategory = (event) => {
    const name = event.target.value;
    setCreatePostData({ ...createPostData, category: name });
  };

  useEffect(() => {
    if (id) {
      getPostData();
      setEditMode(true);
    }
  }, []);

  return (
    <Grid className={classes.root}>
      <Navbar />
      {loading && (
        <Grid
          item
          container
          xs={12}
          justify="center"
          alignItems="center"
          style={{
            position: "fixed",
            zIndex: 1,
            left: 0,
            top: 0,
            height: "100%",
            backgroundColor: "rgba(255,255,255,0.3)",
          }}
        >
          <CircularProgress />
        </Grid>
      )}
      <Grid container xs={12} justify-content="center" className={classes.body}>
        <Grid container xs={12} justify="center">
          <Typography className={classes.title}>Selling</Typography>

          <Grid container xs={12} justify="center">
            <div className="image-wrapper">
              <img
                id="img"
                src={
                  createPostData.image && !tempImg
                    ? createPostData.image
                    : tempImg?.path ?? placeholder
                }
                alt={placeholder}
              />
            </div>
          </Grid>

          {/* button add image */}
          <Grid container xs={10}>
            <Grid container xs={12} justify="center">
              <label for="imgSelect" className={classes.updateImgButton}>
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

            {/* button delete */}
            {tempImg && (
              <Grid container xs={12} justify="center">
                <Button
                  variant="contained"
                  size="large"
                  classes={{
                    root: classes.deleteImgButton,
                    focusVisible: false,
                  }}
                  onClick={() => onRemoveImage()}
                  disableRipple
                  disabled={!tempImg && editMode}
                >
                  Remove Image
                </Button>
              </Grid>
            )}
          </Grid>

          {/* name container */}
          <Grid item xs={10}>
            <TextField
              fullWidth
              className={classes.input}
              variant="outlined"
              value={createPostData.name}
              label="Name"
              onChange={(event) => onChangeText(event.target.value, "name")}
            />
          </Grid>

          {/* brand container */}
          <Grid item xs={10}>
            <TextField
              fullWidth
              className={classes.input}
              variant="outlined"
              value={createPostData.brand}
              label="Brand"
              onChange={(event) => onChangeText(event.target.value, "brand")}
            />
          </Grid>

          {/* enter amount container */}
          <Grid item xs={10}>
            <TextField
              fullWidth
              className={classes.input}
              variant="outlined"
              value={createPostData.price}
              label="Enter Amount (RM)"
              onChange={(event) => onChangeText(event.target.value, "price")}
            />
          </Grid>

          {/* condition container */}
          <Grid item xs={10} style={{ margin: "10px 0" }}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel htmlFor="outlined-age-native-simple">
                Condition Used/New
              </InputLabel>
              <Select
                style={{ width: 400 }}
                native
                value={createPostData.condition}
                onChange={handleChange}
                label="Condition Used/New"
              >
                <option aria-label="None" value="" />
                <option value="Used">Used</option>
                <option value="New">New</option>
              </Select>
            </FormControl>
          </Grid>

          {/* category container */}
          <Grid item xs={10} style={{ margin: "10px 0" }}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel htmlFor="outlined-age-native-simple">
                Fashion / Mobile
              </InputLabel>
              <Select
                style={{ width: 400 }}
                native
                value={createPostData.category}
                onChange={handleChangeCategory}
                label="Fashion / Mobile"
              >
                <option aria-label="None" value="" />
                <option value="Fashion">Fashion</option>
                <option value="Mobile">Mobile</option>
              </Select>
            </FormControl>
          </Grid>

          {/* phone number container */}
          <Grid item xs={10}>
            <TextField
              fullWidth
              className={classes.input}
              variant="outlined"
              value={createPostData.phone}
              label="Contact Number"
              onChange={(event) => onChangeText(event.target.value, "phone")}
            />
          </Grid>

          {/* description container */}
          <Grid item xs={10}>
            <TextField
              fullWidth
              className={classes.input}
              variant="outlined"
              value={createPostData.description}
              label="Description (Say a few things that would make your buyers feel tempted)"
              onChange={(event) =>
                onChangeText(event.target.value, "description")
              }
            />
          </Grid>

          {/* submit container output */}
          <Grid item xs={10} style={{ marginTop: "50px" }}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              color="primary"
              onClick={() => {
                onValidate();
              }}
              disabled={loading}
            >
              {editMode ? "Update" : "Submit"}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UploadPost;
