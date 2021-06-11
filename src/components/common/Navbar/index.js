import {
  AppBar,
  Grid,
  InputAdornment,
  Link,
  makeStyles,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import React from "react";
import { useState } from "react";
import { useHistory } from "react-router";

const useStyle = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: "0px 200px",
  },
  link: {
    fontWeight: "bold",
    cursor: "pointer",
    marginRight: 30,
  },
  linkSignout: { fontWeight: "bold", cursor: "pointer", marginLeft: 10 },
  linkWrapper: {
    display: "flex",
    alignItems: "center",
  },
  search: {
    backgroundColor: "#fff",
    borderRadius: 5,
    border: "none",
  },
  titleWrapper: {
    display: "flex",
    alignSelf: "center",
  },
}));

const Navbar = () => {
  const classes = useStyle();
  const history = useHistory();
  const [searchText, setSearchText] = useState(null);

  const onNavigate = (type) => {
    history.push(`/${type}`);
  };

  const onChangeText = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <AppBar position="fixed" className={classes.root}>
      <Toolbar>
        <Grid container xs={12} direction="row">
          <Grid item xs={3} md={2} className={classes.titleWrapper}>
            <Typography className={classes.title} variant="h6" noWrap>
              MARKT
            </Typography>
          </Grid>

          <Grid item xs={7} className={classes.linkWrapper}>
            <Link
              onClick={() => onNavigate("Home")}
              color="#FFF"
              className={classes.link}
            >
              Home
            </Link>
            <Link
              onClick={() => onNavigate("Home")}
              color="#FFF"
              className={classes.link}
            >
              Profile
            </Link>
            <Link
              onClick={() => onNavigate("Home")}
              color="#FFF"
              className={classes.link}
            >
              Favorites
            </Link>
          </Grid>
          <Grid item xs={2}>
            <TextField
              id="outlined-basic"
              placeholder="Search..."
              variant="outlined"
              size="small"
              onChange={onChangeText}
              value={searchText}
              InputProps={{
                className: classes.search,
                endAdornment: (
                  <InputAdornment position="end">
                    <Search color="#000" />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: false,
              }}
            />
          </Grid>
          <Grid xs={1} className={classes.linkWrapper}>
            <Link
              onClick={() => onNavigate("Home")}
              color="#FFF"
              className={classes.linkSignout}
            >
              Logout
            </Link>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
