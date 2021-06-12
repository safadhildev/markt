import { IconButton, makeStyles } from "@material-ui/core";
import { Favorite, FavoriteBorder } from "@material-ui/icons";
import React from "react";
import "./index.css";

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

const PostItem = ({ data, onFavorite, liked }) => {
  const classes = useStyle();

  return (
    <div className="post-wrapper">
      <div className="post-image-wrapper">
        <img src={data.url} />
      </div>
      <div className="post-content-wrapper">
        <div className="post-content-details">
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
          <IconButton className={classes.iconButton} onClick={onFavorite}>
            {liked ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
