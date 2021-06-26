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
import { AccountCircleRounded, Close, Email, Phone } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import PostItem from "../common/PostItem";

const useStyle = makeStyles((theme) => ({
  root: {
    margin: "80px 0",
  },
  body: {
    margin: "0px 0",
  },
  line: {
    height: "100%",
    width: "1px",
    backgroundColor: "#000",
    [theme.breakpoints.down("md")]: {
      height: "1px",
      width: "100%",
    },
  },
  img: {
    height: 255,
    display: "block",
    maxWidth: 400,
    overflow: "hidden",
    width: "100%",
  },
  textWrapper: { display: "flex", margin: "10px 0" },
  text: {
    margin: "0 10px",
  },
  title: {
    fontWeight: "bold",
    fontSize: "24px",
    margin: "20px 60px 50px 60px",
  },
  imageWrapper: {
    width: "120px",
    height: "120px",
    overflow: "hidden",
    margin: "0 0 20px 0",
    borderRadius: "50%",
    border: "1px solid #000",
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
  const history = useHistory();
  const classes = useStyle();
  const db = firebase.firestore();
  const storageRef = firebase.storage().ref();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tempImg, setTempImg] = useState(null);
  const [searchValue, setSearchValue] = useState(null);
  const [filterData, setFilterData] = useState([]);
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

  const onFilterDataBySearch = () => {
    const filter = postData.filter((item) =>
      item.name.toLowerCase().includes(searchValue)
    );
    setFilterData(filter);
  };

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

  useEffect(() => {
    getPostData();
  }, []);

  const onChangeText = (value) => {
    setSearchValue(value);
  };

  const onEditProfile = () => {
    history.push("/profile/edit");
  };
  const onAddPost = () => {
    history.push("/sell");
  };

  useEffect(() => {
    if (searchValue && searchValue !== "") {
      onFilterDataBySearch();
    } else {
      setFilterData([]);
    }
  }, [searchValue]);

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

  const renderData = () => {
    return (
      <Grid
        item
        container
        xs={12}
        className={classes.body}
        justify="space-around"
      >
        {/* Render Left side */}
        <Grid
          container
          xs={12}
          md={2}
          justify="flex-start"
          style={{ padding: "0 20px" }}
        >
          <Grid item xs={12}>
            <div className={classes.imageWrapper}>
              <img
                id="img"
                src={userData?.image ?? placeholder}
                alt={placeholder}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </Grid>
          <Grid item xs={12} style={{ margin: "0 0 20px 0" }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => onEditProfile()}
              disableRipple
            >
              Edit Profile
            </Button>
          </Grid>
          <Grid
            item
            xs={10}
            justify="flex-start"
            alignItems="center"
            className={classes.textWrapper}
          >
            <AccountCircleRounded />
            <Typography className={classes.text}>
              {userData?.displayName}
            </Typography>
          </Grid>
          <Grid
            item
            xs={10}
            justify="flex-start"
            alignItems="center"
            className={classes.textWrapper}
          >
            <Email />
            <Typography className={classes.text}>{userData?.email}</Typography>
          </Grid>
          <Grid
            item
            xs={10}
            justify="flex-start"
            alignItems="center"
            className={classes.textWrapper}
          >
            <Phone />
            <Typography className={classes.text}>{userData?.phone}</Typography>
          </Grid>
        </Grid>
        {/* render line */}
        <Grid>
          <div className={classes.line}></div>
        </Grid>
        {/* Render Right Side */}
        <Grid item container xs={12} md={8}>
          <Grid
            item
            container
            xs={12}
            justify="space-between"
            alignItems="flex-start"
          >
            <Grid xs={12} md={8} style={{ padding: "0 0 0 20px" }}>
              <TextField
                variant="outlined"
                value={searchValue}
                label="Search"
                size="small"
                onChange={(event) => onChangeText(event.target.value)}
                className={classes.searchInput}
              />
            </Grid>
            <Grid xs={12} md={2} style={{ padding: "0 20px 0 0" }}>
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

          <Grid
            container
            xs={12}
            justify="flex-start"
            alignItems="space-evenly"
          >
            {searchValue
              ? filterData.map(renderItem)
              : postData.length > 0 && postData.map(renderItem)}
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <Grid container xs={12} className={classes.root}>
      <Navbar />
      <Typography className={classes.title}>Profile</Typography>
      {loading && (
        <Grid
          container
          xs={12}
          justify="center"
          style={{
            position: "fixed",
            zIndex: 10,
            width: "100%",
            height: "100vh",
            backgroundColor: "rgba(255,255,255,0.7)",
          }}
        >
          <CircularProgress />
        </Grid>
      )}
      {renderData()}
    </Grid>
  );
};

export default Profile;
