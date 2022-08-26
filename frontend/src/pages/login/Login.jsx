import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./login.css";
const Login = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [email, setEmail] = useState(state?.email || "");
  const [password, setPassowrd] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/login", { email, password });
      if (data) {
		  // If the user is trying to login before accepting the quote
        if (state?.quoteId) {
          navigate(`/quote?quoteId=${state.quoteId}`);
        } else {
          if (data.role === "admin") {
            navigate(`/dashboard`);
          } else {
            navigate(`/`);
          }
        }
      }
    } catch (error) {
      setError(error?.response.data.message);
      console.log(error.message);
    }
    setLoading(false);
  };
  return (
    <div className="loginPage">
      <h1>Se connecter</h1>
      <Box
        component="form"
        sx={{
          textAlign: "center",
          margin: "20px auto",
          width: { xs: "80%", md: "30%" },
        }}
        onSubmit={handleLogin}
      >
        <Box>
          {error && (
            <small style={{ margin: "10px", color: "crimson" }}> {error}</small>
          )}
        </Box>
        <TextField
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ padding: "10px", width: "80%", margin: "20px 0" }}
          label="Adresse Email"
          required

          variant="outlined"
        />
     
        <TextField
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassowrd(e.target.value)}
          sx={{ padding: "10px", width: "80%" }}
          label="Mot de passe"
          required
          variant="outlined"
        />
        <Button
          size="large"
          sx={{ margin: "30px", backgroundColor : "#1D217C" }}
        
          type="submit"
          variant="contained"
        >
          {loading ? "Loading..." : "Se connecter"}
        </Button>
      </Box>
    </div>
  );
};

export default Login;
