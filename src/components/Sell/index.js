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
import {useHistory} from "react-router-dom";

const useStyle = makeStyles((theme) => ({
  root: {
    margin: "80px 0",
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


const Sell = ({setOpen,severity,message})=>{
    const currentUser = firebase.auth().currentUser;
    const history = useHistory();
    const classes = useStyle();
    const db = firebase.firestore();
    const storageRef = firebase.storage().ref();
    const [tempImg, setTempImg] = useState(null);
    const [createPostData, setCreatePostData]= useState({name:'',phone:'',brand:'',price:'',condition:'',category:'',description:''});

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
          email:currentUser.email,

          image: downloadUrl,
        });
      setOpen(true);
      severity("success");
      message("Update Successful!");
      history.replace('/home');
    } catch (error) {
      setOpen(true);
      severity("error");
      message(error.message);
      console.log("Error :: ", error);
    }
  };

    const onValidate=()=>{
        const{
            name,brand,price,condition,category,phone,description
        }=createPostData
        if(
            tempImg===null || name==='' || brand==='' || price=== '' || condition=== '' || category=== '' || phone==='' || description===''
        )
        {
            alert('field cannot be empty') 
        }else{
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
      <Grid
        container
        xs={12}
        justify="center"
        spacing={4}
        className={classes.body}
      >
        <Grid container xs={12} md={5} justify="center">
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
              value={createPostData.name}
              label="Name"
              onChange={(event) =>
                onChangeText(event.target.value, "name")
              }
              
            />
          </Grid>
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
          <Grid item xs={10}>
            <TextField
              fullWidth
              className={classes.input}
              variant="outlined"
              value={createPostData.price}
              label="Price (RM)"
              onChange={(event) => onChangeText(event.target.value, "price")}
            />
          </Grid>
          <Grid item xs={10}>
            <TextField
              fullWidth
              className={classes.input}
              variant="outlined"
              value={createPostData.condition}
              label="Condition (New/Used)"
              onChange={(event) => onChangeText(event.target.value, "condition")}
            />
          </Grid>
          <Grid item xs={10}>
            <TextField
              fullWidth
              className={classes.input}
              variant="outlined"
              value={createPostData.category}
              label="Category Fashion/Mobile"
              onChange={(event) => onChangeText(event.target.value, "category")}
            />
          </Grid>
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
    </Grid>
    )
    
}

export default Sell 

