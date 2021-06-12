import {
  Drawer,
  Grid,
  IconButton,
  makeStyles,
  SwipeableDrawer,
  useMediaQuery,
} from "@material-ui/core";
import { Close, Favorite, FavoriteBorder } from "@material-ui/icons";
import React, { useState } from "react";
import "./index.css";

const styles = {
  mobileDrawer: {
    width: "100%",
    // height: "500px",
    // marginTop: "100px",
  },
};

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
    color: "#f44336",
  },
  iconCloseButton: {
    padding: 0,
    alignItems: "flex-end",
    color: "#EEEEEE",
  },
  loggedText: {
    fontSize: "12px",
  },
  detailsContent: { padding: "20px" },
  detailsText: {
    margin: "10px 0 0 0",
  },
  drawer: {
    paddingTop: "100px",
    overflow: "scroll",
  },
}));

const PostItem = ({ data, onFavorite, liked }) => {
  const classes = useStyle();
  const [selected, setSelected] = useState(null);
  const mobile = useMediaQuery("(max-width:500px)");

  const onSelectItem = () => {
    setSelected(data);
  };

  const onCloseDrawer = () => {
    setSelected(null);
  };

  return (
    <>
      <div className="post-wrapper">
        <div
          className="post-image-wrapper"
          onClick={() => {
            onSelectItem();
          }}
        >
          <img src={data.url} />
        </div>
        <div className="post-content-wrapper">
          <div
            className="post-content-details"
            onClick={() => {
              onSelectItem();
            }}
          >
            <p className="post-text name">{data.name}</p>
            <div className="post-subtitle-wrapper">
              <p className="post-text brand">{data.brand}</p>
            </div>
            {data.price && <p className="post-text price">RM {data.price}</p>}
            <p
              className="post-text condition"
              style={
                data.condition === "New"
                  ? { color: "#4CAF50" }
                  : { color: "#9E9E9E" }
              }
            >
              {data.condition}
            </p>
          </div>
          <div className="post-content-fav">
            <IconButton
              className={classes.iconButton}
              onClick={() => {
                onFavorite();
                setSelected(null);
              }}
            >
              {liked ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </div>
        </div>
      </div>
      {selected && (
        <Drawer
          swipeAreaWidth={20}
          disableSwipeToOpen
          anchor={mobile ? "bottom" : "right"}
          open={selected}
          onClose={() => {
            onCloseDrawer();
          }}
          className={classes.drawer}
        >
          <Grid
            container
            xs={12}
            style={{
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
            }}
          >
            <div style={mobile ? styles.mobileDrawer : { width: "500px" }}>
              <div className="details-image-wrapper">
                <div className="details-close-span">
                  <IconButton
                    className={classes.iconCloseButton}
                    onClick={() => onCloseDrawer()}
                  >
                    <Close />
                  </IconButton>
                </div>
                <img className="details-image" src={selected.url} />
              </div>
              <Grid container xs={12} className={classes.detailsContent}>
                <Grid container xs={12} direction="row" justify="space-between">
                  <Grid item xs={10}>
                    <p className="details-name">{selected.name}</p>
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      className={classes.iconButton}
                      onClick={onFavorite}
                    >
                      {liked ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  className={classes.detailsText}
                  style={{ marginBottom: "20px" }}
                >
                  <p className="details-price">RM {selected.price}</p>
                </Grid>
                <Grid item xs={12} className={classes.detailsText}>
                  <p className="details-brand">
                    Brand: <strong>{selected.brand}</strong>
                  </p>
                </Grid>
                <Grid item xs={12} className={classes.detailsText}>
                  <p className="details-condition">
                    Condition:{" "}
                    <strong
                      style={
                        selected.condition === "New"
                          ? { color: "#4CAF50" }
                          : { color: "#9E9E9E" }
                      }
                    >
                      {selected.condition}
                    </strong>
                  </p>
                </Grid>
                <Grid item xs={12} className={classes.detailsText}>
                  <p className="details-brand">
                    Contact: <strong>{selected.contact}</strong>
                  </p>
                </Grid>
                <Grid item xs={12} className={classes.detailsText}>
                  <p className="details-description-label">Description:</p>
                  <p className="details-description">{selected.description}</p>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Drawer>
      )}
    </>
  );
};

export default PostItem;
