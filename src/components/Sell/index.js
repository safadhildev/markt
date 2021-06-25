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
} from "@material-ui/core";
import Navbar from "../common/Navbar";
import './index.css'
import placeholder from "../../assets/profile-placeholder.png";
import { useHistory } from "react-router-dom";
// new
import PostItem from "../common/PostItem";
// end new
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyle = makeStyles((theme) => ({
  root: {
    margin: "120px 0",
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
    '&:hover': {
      backgroundColor: "#0D47A1"
    },
  },

  deleteImgButton: {
    width: "200px",
    color: "#FFF",
    backgroundColor: "#f44336",
    margin: "10px 0",
    fontSize: "14px",
  },

}));



const Sell = ({ setOpen, severity, message }) => {
  const currentUser = firebase.auth().currentUser;
  const history = useHistory();
  const classes = useStyle();
  const db = firebase.firestore();
  const storageRef = firebase.storage().ref();
  const [tempImg, setTempImg] = useState(null);
  const [createPostData, setCreatePostData] = useState({ name: '', phone: '', brand: '', price: '', condition: '', category: '', description: '' });


  const uploadWithImage = async () => {

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
      message("Update Successful!");
      getPostData();
    } catch (error) {
      setOpen(true);
      severity("error");
      message(error.message);
      console.log("Error :: ", error);
    }
  };

  // function to get the post data into their sell page
  const [postData, setPostData] = useState([]);
  const getPostData = async () => {
    try {
      const querySnapshot = await db.collection("post").get();

      const results = querySnapshot.docs.map((doc) => {
        const formatData = {
          id: doc.id,
          ...doc.data(),
        };
        return formatData;
      });
      const posts = results.filter((item) => item.email === currentUser.email);

      setPostData(posts);
    } catch (error) {
      console.log("getPostData ::", error);
    }
  };

  useEffect(() => {
    getPostData();
  }, []);


  // function to add item into listing sell
  const onValidate = () => {
    const {
      name, brand, price, condition, category, phone, description
    } = createPostData
    if (
      tempImg === null || name === '' || brand === '' || price === '' || condition === '' || category === '' || phone === '' || description === ''
    ) {
      alert('field cannot be empty')
    } else {
      uploadWithImage()
    }
  }


  const onDeleteImage = () => {
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
      const reader = new FileReader();
      reader.onload = function (event) {
        setTempImg({ path: event.target.result, file: input.target.files[0] });
      };
      reader.readAsDataURL(input.target.files[0]);
    }
  };

  const handleChange = (event) => {
    const name = event.target.value;
    setCreatePostData({ ...createPostData, condition: name })
  };

  const handleChangeCategory = (event) => {
    const name = event.target.value;
    setCreatePostData({ ...createPostData, category: name })
  };

  const renderItem = (item) => {

    return (
      <PostItem
        data={item}
      />
    );
  };

  return (
    <Grid
      container
      xs={12}
      className={classes.root}
      direction="row"
      justify-content="flex-start"
      alignItems="flex-start"
      display="flex"

    >
      <Navbar />
      <Grid
        container
        xs={4}
        justify-content="center"
        spacing={4}
        className={classes.body}
      >
        <Grid container xs={12} justify="center">
          <Typography className={classes.title}>Selling</Typography>

          <Grid container xs={12} justify="center">
            <div className="image-wrapper">
              <img
                id="img"
                src={
                  tempImg?.path ?? placeholder
                }
                alt={placeholder}
              />
            </div>
          </Grid>

          {/* button add image */}
          <Grid container xs={10}>
            <Grid container xs={12} justify="center">
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

            {/* button delete */}
            <Grid container xs={12} justify="center">
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

          {/* name container */}
          <Grid item xs={10}>
            <TextField
              fullWidth
              className={classes.input}
              variant="outlined"
              value={createPostData.name}
              label="Name"
              onChange={(event) =>
                onChangeText(event.target.value, "name")
              }
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
              onChange={(event) =>
                onChangeText(event.target.value, "brand")
              }
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
          <Grid item xs={10} style={{margin:'10px 0'}}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel htmlFor="outlined-age-native-simple">Condition Used/New</InputLabel>
              <Select style={{ width: 400 }}
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
          <Grid item xs={10} style={{ margin: '10px 0' }}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel htmlFor="outlined-age-native-simple">Fashion / Mobile</InputLabel>
              <Select style={{ width: 400 }}
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
              onChange={(event) => onChangeText(event.target.value, "description")}
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
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Grid>

      {/* display sell box righ side */}
      <Grid
        container
        xs={8}
        justify="flex-start"
        alignItems="space-evenly"
      >
        {postData.length > 0 && postData.map(renderItem)}

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


  )

}

export default Sell;

