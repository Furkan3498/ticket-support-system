import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Yetkisiz Erişim
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bu sayfaya erişim yetkiniz bulunmamaktadır.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        Anasayfa
      </Button>
    </Box>
  );
};

export default Unauthorized;
