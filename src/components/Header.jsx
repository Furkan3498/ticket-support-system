import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleMenuClose();
  };

  const goTo = (path) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate(role === "ADMIN" ? "/admin" : "/panel")}
        >
          Destek Talep Sistemi
        </Typography>

      
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
          {token ? (
            <>
              <Typography>{role}</Typography>
              <Button color="inherit" onClick={handleLogout}>
                Çıkış Yap
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Giriş
              </Button>
              <Button color="inherit" onClick={() => navigate("/register")}>
                Kayıt
              </Button>
            </>
          )}
        </Box>

        
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>

          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            {token
              ? [
                  <MenuItem key="role" disabled>{role}</MenuItem>,
                  <MenuItem key="logout" onClick={handleLogout}>Çıkış Yap</MenuItem>,
                ]
              : [
                  <MenuItem key="login" onClick={() => goTo("/login")}>Giriş</MenuItem>,
                  <MenuItem key="register" onClick={() => goTo("/register")}>Kayıt</MenuItem>,
                ]}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
