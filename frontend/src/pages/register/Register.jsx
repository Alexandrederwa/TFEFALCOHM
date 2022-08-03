import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./register.css";
const Register = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [email, setEmail] = useState(state?.email || "");
  const [password, setPassowrd] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked(!checked);
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const { data } = await axios.post("auth/register", {
        email,
        password,
        name: username,
        subscribed: checked,
      });
      if (data) {
		  // if the user isn't registerd he will register and then go to login page with that quoteId too fetch the quote in future
        navigate(`/login`, {
          state: { quoteId: state?.quoteId, email },
        });
        setLoading(false);
      }
    } catch (error) {
      setError(error?.response.data.message);
      setLoading(false);
    }
  };
  return (
    <div className="registerPage">
      <h1>Register</h1>
      <Box
        component="form"
        sx={{
          textAlign: "center",
          margin: "20px auto",
          width: { xs: "80%", md: "30%" },
        }}
        onSubmit={handleRegister}
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
          label="Email"
          required
          variant="outlined"
        />
        <TextField
          id="email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ padding: "10px", width: "80%", margin: "20px 0" }}
          label="Username"
          required
          variant="outlined"
        />
          <TextField
          id="password"
          value={password}
          required
            onChange={(e) => setPassowrd(e.target.value)}
          sx={{ padding: "10px", width: "80%", margin: "20px 0" }}
          label="Password"
          variant="outlined"
        />
      

        <div className="checkBoxSection">
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={handleChange}
               
              />
            }
            label="Subscribe for Notifications"
          />
        </div>

        <Button
          size="large"
          sx={{ margin: "30px" }}
          required
          variant="contained"
          color="warning" type="submit">
          {loading ? "Loading..." : "Register"}
        </Button>
      </Box>
    </div>
  );
};

export default Register;
