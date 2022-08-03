import { Box, Button, TextField, Typography } from "@mui/material";

import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import { useUser } from "../../store";
// import "./requestQuote.css";
const RequestQuote = () => {
  const { user } = useUser();
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [party, setParty] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const handleRequestQuote = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await axios.post("quotes/request", {
        email,
        party,
        phone,
      });
      if (data) {
        navigate(`/`);
      }
      setLoading(false);

    } catch (error) {
      alert(error?.message);
      setError(error?.response.data.message);
      setLoading(false);
      console.log(error?.response.data.message);
    }
  };
  return (
    <Box
      component="form"
      sx={{
        m: 1,
        width: { md: "30%", xs: "70%" },
        margin: "auto",
      }}
      noValidate
      autoComplete="off"
    >
      <Typography
        gutterBottom
        variant="h4"
        sx={{ textAlign: "center", fontWeight: "bold", marginTop: "20px" }}
        component="div"
      >
        Request Quote
      </Typography>

      <small style={{ margin: "10px", color: "crimson" }}> {error}</small>
      <Box sx={{ textAlign: "center" }}>
        <TextField
          type="email"
          value={email}
          sx={{ width: "80%", margin: " 10px auto", padding: "4px" }}
          onChange={(e) => setEmail(e.target.value)}
          label="Email "
        />
      </Box>

      <Box sx={{ textAlign: "center" }}>
        <TextField
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          value={phone}
          sx={{ width: "80%", margin: " 10px auto", padding: "4px" }}
          onChange={(e) => setPhone(e.target.value)}
          label="Phone number"
        />
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <TextField
          type="number"
          value={party}
          multiline
          rows={5}
          sx={{ width: "80%", margin: " 10px auto", padding: "4px" }}
          onChange={(e) => setParty(e.target.value)}
          label="Party Details "
        />
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          onClick={handleRequestQuote}
          color="warning"
          endIcon={<SendIcon />}
        >
          {loading ? "Loading" : " Request Quote"}
        </Button>
      </Box>
    </Box>
  );
};

export default RequestQuote;
