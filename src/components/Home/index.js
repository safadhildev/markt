import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import "./index.css";
import firebase from "firebase/app";
import "firebase/firestore";
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  MobileStepper,
  TextField,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import Navbar from "../common/Navbar";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import {
  Favorite,
  FavoriteBorder,
  FavoriteOutlined,
  Search,
} from "@material-ui/icons";
import PostItem from "../common/PostItem";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const tutorialSteps = [
  {
    label: "San Francisco – Oakland Bay Bridge, United States",
    imgPath:
      "https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60",
  },
  {
    label: "Bird",
    imgPath:
      "https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60",
  },
  {
    label: "Bali, Indonesia",
    imgPath:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250&q=80",
  },
  {
    label: "NeONBRAND Digital Marketing, Las Vegas, United States",
    imgPath:
      "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&w=400&h=250&q=60",
  },
  {
    label: "Goč, Serbia",
    imgPath:
      "https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60",
  },
];

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
  loggedText: {
    fontSize: "12px",
  },
}));

const Home = () => {
  const user = firebase.auth().currentUser;
  const classes = useStyle();
  const db = firebase.firestore();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [searchText, setSearchText] = useState(null);

  const mobile = useMediaQuery("(max-width:400px)");
  const tablet = useMediaQuery("(max-width:700px)");

  const getData = async () => {
    try {
      const querySnapshot = await db.collection("image").get();
      const results = querySnapshot.docs.map((doc) => {
        const formatData = {
          id: doc.id,
          ...doc.data(),
        };

        return formatData;
      });
      setLoading(false);
      setData(results);
    } catch (error) {
      setLoading(false);
      console.log("Home - getData :: ", error);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  useEffect(() => {
    setLoading(true);
    // getUserData();
    getData();
  }, []);

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

  const onFavorite = async (item) => {
    try {
      const user = firebase.auth().currentUser;
      const isLikedByUser = userData?.likes?.find((like) => like === item.id);
      let newArray = userData.likes;

      if (isLikedByUser) {
        // remove
        newArray = userData?.likes?.filter((like) => like !== item.id);
      } else {
        // add
        newArray.push(item.id);
      }
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

  const renderLoading = () => {
    return (
      <Grid
        container
        xs={12}
        direction="column"
        alignItems="center"
        // justify="center"
        style={{ minHeight: "100vh" }}
      >
        <CircularProgress />
      </Grid>
    );
  };

  const renderItem = (item) => {
    const isLikedByUser = userData?.likes?.find((like) => like === item.id);

    return (
      <PostItem
        liked={isLikedByUser}
        data={item}
        onFavorite={() => {
          onFavorite(item);
        }}
      />
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
        <Grid
          container
          xs={mobile ? 10 : 7}
          justify="flex-start"
          alignItems="space-evenly"
          style={{ margin: "10px 0 30px 0" }}
        >
          <Typography className={classes.loggedText}>
            Logged In as : {user.email}
          </Typography>
        </Grid>
        {mobile && (
          <Grid
            xs={12}
            style={{
              margin: "0 0 20px 0",
              width: "80%",
            }}
          >
            <TextField
              fullWidth
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
          xs={11}
          sm={8}
          lg={7}
          justify="flex-start"
          alignItems="space-evenly"
        >
          <AutoPlaySwipeableViews
            axis={"x"}
            index={activeStep}
            onChangeIndex={handleStepChange}
            enableMouseEvents
          >
            {tutorialSteps.map((step, index) => (
              <div key={step.label} className="slider-img-wrapper">
                {Math.abs(activeStep - index) <= 2 ? (
                  <img
                    className="slider-img"
                    src={step.imgPath}
                    alt={step.label}
                  />
                ) : null}
              </div>
            ))}
          </AutoPlaySwipeableViews>
        </Grid>
        <MobileStepper
          variant="dots"
          steps={tutorialSteps.length}
          position="static"
          activeStep={activeStep}
          className={classes.stepper}
        />
        {/* <div className="post-container">
          {data.length > 0 && data.map(renderItem)}
        </div> */}
        <Grid
          container
          xs={11}
          sm={8}
          lg={7}
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
      <Navbar
        search
        onSearch={() => {
          onSearch();
        }}
        onChangeText={onChangeText}
        searchText={searchText}
      />
      {loading ? renderLoading() : renderData()}
    </Grid>
  );
};

export default Home;
