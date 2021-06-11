import {
  AppBar,
  Divider,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Home, Inbox, Mail, Menu, Search } from "@material-ui/icons";
import React from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyle = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: "0px 200px",
    [theme.breakpoints.down("sm")]: {
      padding: 0,
    },
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
  drawer: {
    width: "80%",
  },
}));

const navigationList = ["home", "profile", "saved", "logout"];

const Navbar = ({ search, onSearch, onChangeText, searchText }) => {
  const classes = useStyle();
  const history = useHistory();
  const [showDrawer, setShowDrawer] = useState(false);
  const mobile = useMediaQuery("(max-width:700px)");

  const onNavigate = (type) => {
    setShowDrawer(false);
    history.push(`/${type}`);
  };

  const onCloseDrawer = () => {
    setShowDrawer(false);
  };

  const handleClick = (type) => {
    setShowDrawer(false);
    history.push(`/${type}`);
  };

  const onLogout = () => {
    setShowDrawer(false);
    history.push("/");
  };

  return (
    <AppBar position="fixed" className={classes.root}>
      <Toolbar>
        <Grid container xs={12} direction="row">
          {mobile && (
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={() => {
                setShowDrawer(true);
              }}
            >
              <Menu />
            </IconButton>
          )}
          <Grid item xs={10} md={2} className={classes.titleWrapper}>
            <Typography className={classes.title} variant="h6" noWrap>
              MARKT
            </Typography>
          </Grid>

          {!mobile && (
            <>
              <Grid item xs={7} className={classes.linkWrapper}>
                <Link
                  onClick={() => onNavigate("home")}
                  color="#FFF"
                  className={classes.link}
                >
                  Home
                </Link>
                <Link
                  onClick={() => onNavigate("profile")}
                  color="#FFF"
                  className={classes.link}
                >
                  Profile
                </Link>
                <Link
                  onClick={() => onNavigate("saved")}
                  color="#FFF"
                  className={classes.link}
                >
                  Favorites
                </Link>
              </Grid>
              {search && (
                <Grid item xs={2}>
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
                        <InputAdornment position="end" onClick={onSearch}>
                          <Search color="#000" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              )}
              <Grid xs={1} className={classes.linkWrapper}>
                <Link
                  onClick={() => onLogout()}
                  color="#FFF"
                  className={classes.linkSignout}
                >
                  Logout
                </Link>
              </Grid>
            </>
          )}
        </Grid>
      </Toolbar>
      <Drawer
        anchor="left"
        open={showDrawer}
        onClose={() => {
          onCloseDrawer();
        }}
        className={classes.drawer}
        style={{ width: 200 }}
      >
        <div style={{ width: 300 }}>
          <ListItem button key={"home"} onClick={() => handleClick("home")}>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <Divider />
          <ListItem button key={"logout"} onClick={() => onLogout()}>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </div>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
