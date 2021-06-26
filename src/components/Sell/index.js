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
import "./index.css";
import placeholder from "../../assets/profile-placeholder.png";
import { useHistory } from "react-router-dom";
// new
import PostItem from "../common/PostItem";
// end new
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

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

const Sell = ({ setOpen, severity, message }) => {
  const currentUser = firebase.auth().currentUser;
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const classes = useStyle();
  const db = firebase.firestore();
  const storageRef = firebase.storage().ref();

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
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("getPostData ::", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    getPostData();
  }, []);

  const onDeletePost = async (item) => {
    try {
      setLoading(true);
      // 1) delete image from firebase storage
      await firebase.storage().refFromURL(item.image).delete();
      // 2) delete data from firestore database
      await db.collection("post").doc(item.id).delete();
      setOpen(true);
      severity("success");
      message("Successfully delete sell post");
      getPostData();
    } catch (error) {
      setLoading(false);
      setOpen(true);
      severity("error");
      message(error.message);
      console.log("onDeletePost :: ", error);
    }
  };

  const onAddPost = () => {
    history.push("/post");
  };

  const renderItem = (item) => {
    return (
      <PostItem
        data={item}
        hasDelete
        hasEdit
        onEdit={() => {
          history.push(`/post/${item.id}`);
        }}
        onDelete={() => {
          if (
            window.confirm(
              "Are you sure you want to permanently delete the selected post?"
            )
          ) {
            onDeletePost(item);
          }
        }}
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
      {loading && (
        <Grid
          item
          container
          xs={12}
          style={{
            justifyContent: "center",
            position: "absolute",
            top: "80px",
            left: 0,
          }}
        >
          <CircularProgress />
        </Grid>
      )}
      <Grid item container xs={12}>
        <Grid xs={12} md={8}></Grid>
        <Grid xs={12} md={4}>
          <Button
            variant="contained"
            onClick={() => {
              onAddPost();
            }}
          >
            Add Post
          </Button>
        </Grid>
      </Grid>

      <Grid container xs={8} justify="flex-start" alignItems="space-evenly">
        {postData.length > 0 && postData.map(renderItem)}
      </Grid>
    </Grid>
  );
};

export default Sell;
