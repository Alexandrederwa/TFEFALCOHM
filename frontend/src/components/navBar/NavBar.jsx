import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import "./navbar.css"
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useMediaQuery } from 'react-responsive'
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../store";


const AppBarX = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const { setUser, user } = useUser();
  const navigate = useNavigate();
  const isBigScreen = useMediaQuery({ query: '(min-width: 769px)' })
  const logout = async () => {
    navigate(`/`);
    await axios.post("/api/auth/logout");
    window.location.reload();
  };
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await axios.get("/api/auth/getUser");
        setUser(data);
      } catch (error) {}
    };
    if (!user) {
      checkUser();
    }

    // eslint-disable-next-line
  }, [navigate]);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static " style={{ background: 'transparent', boxShadow: 'none'}} className="navbar">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
            {/* {isBigScreen ?   */}
                  <a href="/" rel="noreferrer">
                      <img
                        src="https://res.cloudinary.com/dutkkgjm5/image/upload/v1660661664/FALCOHM_SYSTEM_typo_black_j97kpy.png"
                        alt="logoNavBar"
                        className="logoFont"
                      />
                  </a> 
                  {/* // :  */}
                  {/* <a href="/" rel="noreferrer">
                  <img
                    src="https://res.cloudinary.com/dutkkgjm5/image/upload/v1660661664/FALCOHM_SYSTEM_typo_white_vdrtbl.png"
                    alt="logoNavBar"
                    className="logoFont"
                  />
                  </a>  */}
            {/* // } */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              style={{color: "black"}}
              className="openNavbarButton"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem   component={Link}
                  to={"/"} onClick={handleCloseNavMenu}>
                <Typography
                  sx={{ textAlign: "center", color: "black",textDecoration:"none" }}
                  onClick={handleCloseNavMenu}
                
                >
                  Accueil
                </Typography>
              </MenuItem>
              {user && (
                <MenuItem component={Link}
                to={"/profile"} onClick={handleCloseNavMenu}>
                  <Typography
                    sx={{ textAlign: "center", color: "black" }}
                    onClick={handleCloseNavMenu}
                    
                  >
                    Profil
                  </Typography>
                </MenuItem>
              )}
              {user?.role === "admin" ? (
                <MenuItem   component={Link}
                to={"/dashboard"} onClick={handleCloseNavMenu}>
                  <Typography
                    sx={{ textAlign: "center", color: "black" }}
                    onClick={handleCloseNavMenu}
                  
                  >
                    Administration
                  </Typography>
                </MenuItem>
              ) : null}
              {user?.role !== "admin" ? (
                <MenuItem  component={Link}
                to={"/request_quote"} onClick={handleCloseNavMenu}>
                  <Typography
                    sx={{ textAlign: "center", color: "black" }}
                    onClick={handleCloseNavMenu}
                   
                  >
                    Demander un devis
                  </Typography>
                </MenuItem>
              ) : null}
              {user?.role !== "admin" ? (
                <MenuItem  component={Link}
                to={"/items_list"} onClick={handleCloseNavMenu}>
                  <Typography
                    sx={{ textAlign: "center", color: "black",textDecoration:"none" }}
                    onClick={handleCloseNavMenu}
                   
                  >
                    Créer un devis
                  </Typography>
                </MenuItem>
              ) : null}
              {user?.role === "user" ? (
                <MenuItem  component={Link}
                to={"/my_quotes"} onClick={handleCloseNavMenu}>
                  <Typography
                    sx={{ textAlign: "center", color: "black" }}
                    onClick={handleCloseNavMenu}
                   
                  >
                    Mes devis
                  </Typography>
                </MenuItem>
              ) : null}
              {!user && (
                <MenuItem  component={Link}
                to={"/login"} onClick={handleCloseNavMenu}>
                  <Typography
                    sx={{ textAlign: "center", color: "black",textDecoration:"none" }}
                    onClick={handleCloseNavMenu}
                   
                  >
                    Se connecter
                  </Typography>
                </MenuItem>
              )}
              {!user && (
                <MenuItem  component={Link}
                to={"/register"} onClick={handleCloseNavMenu}>
                  <Typography
                    sx={{ textAlign: "center", color: "black" }}
                    onClick={handleCloseNavMenu}
                   
                  >
                    Créer un compte
                  </Typography>
                </MenuItem>
              )}
              {user && (
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography
                    sx={{ textAlign: "center", color: "black" }}
                    onClick={logout}
                  >
                    Se déconnecter 
                  </Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
          {/* Little screen title */}
          {/* Big screen navbar */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: { md: "right" },
            }}
            className = "navAllLinksBS"
          >
          
            <Button
              sx={{ my: 2, color: "black", display: "block"}}
              onClick={handleCloseNavMenu}
              component={Link}
              className = "navLinkBS"
              to={"/"}
            >
              Accueil
            </Button>

            {user?.role === "admin" ? (
              <Button
                sx={{ my: 2, color: "black", display: "block" }}
                onClick={handleCloseNavMenu}
                className = "navLinkBS"
                component={Link}
                to={"/dashboard"}
              >
                Administration
              </Button>
            ) : null}
            {user?.role === "admin" ? (
              <Button
                sx={{ my: 2, color: "black", display: "block" }}
                onClick={handleCloseNavMenu}
                className = "navLinkBS"
                component={Link}
                to={"/items_list"}
              >
                Créer un devis
              </Button>
            ) : null}
            {user?.role !== "admin" ? (
              <Button
                sx={{ my: 2, color: "black", display: "block" }}
                onClick={handleCloseNavMenu}
                className = "navLinkBS"
                component={Link}
                to={"/request_quote"}
              >
                Demander un devis
              </Button>
            ) : null}
            {user?.role === "user" ? (
              <Button
                sx={{ my: 2, color: "black", display: "block" }}
                onClick={handleCloseNavMenu}
                className = "navLinkBS"
                component={Link}
                to={"/my_quotes"}
              >
                Mes devis
              </Button>
            ) : null}
            {!user && (
              <Button
                sx={{ my: 2, color: "black", display: "block" }}
                onClick={handleCloseNavMenu}
                className = "navLinkBS"
                component={Link}
                to={"/login"}
              >
                Se connecter
              </Button>
            )}
            {!user && (
              <Button
                sx={{ my: 2, color: "black", display: "block" }}
                onClick={handleCloseNavMenu}
                component={Link}
                className = "navLinkBS"
                to={"/register"}
              >
                Créer un compte
              </Button>
            )}
            {user && (
              <Button
                sx={{ my: 2, color: "black", display: "block" }}
                onClick={handleCloseNavMenu}
                component={Link}
                className = "navLinkBS"
                to={"/profile"}
              >
                Mon profil
              </Button>
            )}
            {user && (
              <Button
                sx={{ my: 2, color: "black", display: "block" }}
                onClick={logout}
                className = "navLinkBS"
              >
                Se déconnecter
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AppBarX;
