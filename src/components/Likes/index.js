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
} from "@material-ui/core";
import Navbar from "../common/Navbar";
import { Favorite, FavoriteBorder, Search } from "@material-ui/icons";

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
  iconButton: {
    padding: 0,
    alignItems: "flex-end",
  },
}));

const Likes = () => {
  const user = firebase.auth().currentUser;
  const classes = useStyle();
  const db = firebase.firestore();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [searchText, setSearchText] = useState(null);
  const mobile = useMediaQuery("(max-width:700px)");

  const getLikesData = async () => {
    try {
      if (userData.likes.length > 0) {
        const querySnapshot = await db
          .collection("image")
          .where(
            firebase.firestore.FieldPath.documentId(),
            "in",
            userData?.likes
          )
          .get();

        const results = querySnapshot.docs.map((doc) => {
          const formatData = {
            id: doc.id,
            ...doc.data(),
          };
          return formatData;
        });
        setLoading(false);
        setData(results);
      }
    } catch (error) {
      console.log("getLikesData :: ", error);
    }
  };

  const onReadUserData = (doc) => {
    console.log({ doc });
    if (doc.exists) {
      setUserData({
        id: user.uid,
        ...doc.data(),
      });
    }
  };

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(user.uid)
      .onSnapshot(onReadUserData);
    return unsubscribe;
  }, []);

  useEffect(() => {
    // setLoading(true);
    getLikesData();
  }, [userData.likes]);

  const onFavorite = async (item) => {
    try {
      const user = firebase.auth().currentUser;
      let newArray = userData.likes;
      newArray = userData?.likes?.filter((like) => like !== item.id);
      await db.collection("users").doc(user.uid).update({
        likes: newArray,
      });
    } catch (error) {
      console.log("onFavorite :: ", error);
    }
  };

  const onSearch = () => {
    setLoading(true);
    const searchResults = data.filter((item) => item.name.includes(searchText));
    setData(searchResults);
    setLoading(false);
  };

  const onChangeText = (event) => {
    setSearchText(event.target.value);
  };

  const renderItem = (item) => {
    const isLikedByUser = userData?.likes?.find((like) => like === item.id);

    return (
      <div className="post-wrapper">
        <div className="post-image-wrapper">
          <img src={item.url} />
        </div>
        <div className="post-content-wrapper">
          <div className="post-content-details">
            <p className="post-name">{item.name}</p>
            {item.price && <p>RM {item.price}</p>}
          </div>
          <div className="post-content-fav">
            <IconButton
              className={classes.iconButton}
              onClick={() => {
                onFavorite(item);
              }}
            >
              {isLikedByUser ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </div>
        </div>
      </div>
    );
  };

  const renderData = () => {
    return (
      <Grid
        container
        xs={12}
        direction="column"
        alignItems="center"
        justify="center"
      >
        {mobile && (
          <Grid xs={12}>
            <TextField
              id="search-input"
              placeholder="Search..."
              variant="outlined"
              size="small"
              onChange={onChangeText}
              value={searchText}
              InputProps={{
                className: classes.search,
                endAdornment: (
                  <IconButton
                    color="primary"
                    component="span"
                    onClick={() => onSearch()}
                  >
                    <Search />
                  </IconButton>
                ),
              }}
            />
          </Grid>
        )}
        <Grid
          container
          xs={mobile ? 10 : 7}
          justify="flex-start"
          alignItems="space-evenly"
        >
          {data.length > 0 && data.map(renderItem)}
        </Grid>
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
      {renderData()}
    </Grid>
  );
};

export default Likes;
