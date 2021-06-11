import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import "./index.css";
import firebase from "firebase/app";
import "firebase/firestore";
import {
  CircularProgress,
  Grid,
  makeStyles,
  MobileStepper,
} from "@material-ui/core";
import Navbar from "../common/Navbar";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";

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
}));

const Home = () => {
  const classes = useStyle();
  const db = firebase.firestore();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = tutorialSteps.length;

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
    getData();
  }, []);

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
    return (
      <div className="post-wrapper">
        <div className="post-image-wrapper">
          <img src={item.url} />
        </div>
        <div className="post-content-wrapper">
          <p className="post-name">{item.name}</p>
          {item.price && <p>RM {item.price}</p>}
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
        <div className="slider-container">
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
        </div>
        <MobileStepper
          variant="dots"
          steps={tutorialSteps.length}
          position="static"
          activeStep={activeStep}
          className={classes.stepper}
        />
        <div className="post-container">
          {data.length > 0 && data.map(renderItem)}
        </div>
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

export default Home;
