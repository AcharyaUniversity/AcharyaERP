import { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  ListItemText,
  ListItemIcon,
  ListItemButton,
  CssBaseline,
  List,
  Box,
  Collapse,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import iconsList from "../utils/MenuIcons";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  listItemButton: {
    minHeight: 48,

    "&:hover": { background: `#fff1 !important` },
  },
  listItemIcon: {
    minWidth: "0 !important",
    width: 15,
    color: "white !important",
  },
  menuTextContainer: {
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subMenuTextContainer: {
    fontSize: "0.85rem",
  },
  pagesContainer: {
    background: `#ffffff0a !important`,
    padding: "3px 7px !important",
  },
  pageButton: {
    borderRadius: "7px !important",
    padding: "4px 0 2px 47px !important",
    margin: "4px auto !important",

    "&:hover": { background: `#fff1 !important` },
  },
  selectedPage: {
    background: "#fff1 !important",
    borderRadius: "7px !important",
    padding: "4px 0 4px 47px !important",
    margin: "4px auto !important",
  },
}));

const drawerWidth = 253;

const drawerOpenedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(6.5)} + 1px)`,
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "drawerOpen",
})(({ theme, drawerOpen }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",

  ...(drawerOpen && {
    ...drawerOpenedMixin(theme),
    "& .MuiDrawer-paper": drawerOpenedMixin(theme),
  }),
  ...(!drawerOpen && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

// a function which returns the MUI icon object using the name
// if no object matches the given name, default icon is returned
const getIcon = (iName) => {
  const object = iconsList.filter((obj) => obj.name === iName)[0];
  return object
    ? object.icon
    : iconsList.filter((obj) => obj.name === "Default")[0].icon;
};

function Sidebar({ menus, menuOpen, setMenuOpen, activeSubMenu }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const classes = useStyles();

  const navigate = useNavigate();

  const handleDrawerdrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleMenuToggle = (e) => {
    setMenuOpen((prev) => ({
      ...prev,
      [e.target.innerText]: !prev[e.target.innerText],
    }));
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        drawerOpen={drawerOpen}
        onMouseEnter={handleDrawerdrawerOpen}
        onMouseLeave={handleDrawerClose}
      >
        <List sx={{ mt: 7 }}>
          {menus &&
            Object.keys(menus).map((menuName) => {
              return (
                <div key={menuName}>
                  <ListItemButton
                    onClick={handleMenuToggle}
                    className={classes.listItemButton}
                    sx={{
                      justifyContent: drawerOpen ? "initial" : "center",
                      pl: 1.65,
                    }}
                  >
                    <ListItemIcon
                      className={classes.listItemIcon}
                      sx={{ zIndex: -1 }}
                    >
                      {getIcon(menus[menuName].iconName)}
                    </ListItemIcon>
                    <ListItemText
                      sx={{
                        ml: drawerOpen ? 2 : 0,
                        opacity: drawerOpen ? 1 : 0,
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      <div className={classes.menuTextContainer}>
                        {menuName}
                        {menuOpen[menuName] ? <ExpandLess /> : <ExpandMore />}
                      </div>
                    </ListItemText>
                  </ListItemButton>
                  <Collapse
                    in={menuOpen[menuName]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List disablePadding className={classes.pagesContainer}>
                      {Object.keys(menus[menuName])
                        .filter((str) => str !== "iconName")
                        .map((subMenuName) => (
                          <ListItemButton
                            key={subMenuName}
                            onClick={() =>
                              navigate(menus[menuName][subMenuName])
                            }
                            className={
                              activeSubMenu === subMenuName
                                ? classes.selectedPage
                                : classes.pageButton
                            }
                          >
                            <ListItemText>
                              <div className={classes.subMenuTextContainer}>
                                {subMenuName}
                              </div>
                            </ListItemText>
                          </ListItemButton>
                        ))}
                    </List>
                  </Collapse>
                </div>
              );
            })}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }} />
    </Box>
  );
}

export default Sidebar;
