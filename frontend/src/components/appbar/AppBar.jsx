import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../store";

const AppBarX = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const { setUser, user } = useUser();
  const navigate = useNavigate();
  const logout = async () => {
    await axios.post("auth/logout");
    window.location.reload();
  };
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await axios.get("/auth/getUser");
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
    <AppBar position="static" sx={{ backgroundColor: "crimson" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 800,
              fontSize: "30px",
              margin: { md: " 0 30px" },
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            MarketPlace
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
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
                  Home
                </Typography>
              </MenuItem>
              {user && (
                <MenuItem component={Link}
                to={"/profile"} onClick={handleCloseNavMenu}>
                  <Typography
                    sx={{ textAlign: "center", color: "black" }}
                    onClick={handleCloseNavMenu}
                    
                  >
                    Profile
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
                    dashboard
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
                    Request-Qute
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
                    Create-Quote
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
                    Quote-History
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
                    Login
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
                    Register
                  </Typography>
                </MenuItem>
              )}
              {user && (
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography
                    sx={{ textAlign: "center", color: "black" }}
                    onClick={logout}
                  >
                    Logout
                  </Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 800,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            MarketPlace
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: { md: "right" },
            }}
          >
            <Button
              sx={{ my: 2, color: "white", display: "block" }}
              onClick={handleCloseNavMenu}
              component={Link}
              to={"/"}
            >
              Home
            </Button>

            {user && (
              <Button
                sx={{ my: 2, color: "white", display: "block" }}
                onClick={handleCloseNavMenu}
                component={Link}
                to={"/profile"}
              >
                Profile
              </Button>
            )}
            {user?.role === "admin" ? (
              <Button
                sx={{ my: 2, color: "white", display: "block" }}
                onClick={handleCloseNavMenu}
                component={Link}
                to={"/dashboard"}
              >
                Dashboard
              </Button>
            ) : null}
            {user?.role === "admin" ? (
              <Button
                sx={{ my: 2, color: "white", display: "block" }}
                onClick={handleCloseNavMenu}
                component={Link}
                to={"/items_list"}
              >
                Create-Quote
              </Button>
            ) : null}
            {user?.role !== "admin" ? (
              <Button
                sx={{ my: 2, color: "white", display: "block" }}
                onClick={handleCloseNavMenu}
                component={Link}
                to={"/request_quote"}
              >
                Request-Quote
              </Button>
            ) : null}
            {user?.role === "user" ? (
              <Button
                sx={{ my: 2, color: "white", display: "block" }}
                onClick={handleCloseNavMenu}
                component={Link}
                to={"/my_quotes"}
              >
                Request-History
              </Button>
            ) : null}
            {!user && (
              <Button
                sx={{ my: 2, color: "white", display: "block" }}
                onClick={handleCloseNavMenu}
                component={Link}
                to={"/login"}
              >
                Login
              </Button>
            )}
            {!user && (
              <Button
                sx={{ my: 2, color: "white", display: "block" }}
                onClick={handleCloseNavMenu}
                component={Link}
                to={"/register"}
              >
                Register
              </Button>
            )}
            {user && (
              <Button
                sx={{ my: 2, color: "white", display: "block" }}
                onClick={logout}
              >
                logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AppBarX;
