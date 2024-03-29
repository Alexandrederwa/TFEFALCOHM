import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./register.css"
import { useUser } from "../../store";
import { useEffect } from "react";
const Register = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [email, setEmail] = useState(state?.email || "");
  const [password, setPassowrd] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const { user } = useUser();

  const handleChange = () => {
    setChecked(!checked);
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/register", {
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
  // useEffect(() => {
  //   const FetchUser = async () => {
  //     const { user } = useUser();
      // console.log(user)
  //   };
  //   // eslint-disable-next-line
  // }, []);
  return (
    <div className="registerPage">
      <h1>Créer ton compte</h1>
      <Box
        component="form"
        sx={{
          textAlign: "center",
          margin: "20px auto",
          width: { xs: "80%", md: "30%" },
        }}
        data-testid="boxTest"
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
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
          sx={{ padding: "10px", width: "80%", margin: "20px 0" }}
          label="Adresse Email"
          required
          variant="outlined"
        />
        <TextField
          id="email"
          value={username}
          data-testid="emailTest"
          onChange={(e) => setUsername(e.target.value)}
          sx={{ padding: "10px", width: "80%", margin: "20px 0" }}
          label="Nom"
          required
          variant="outlined"
        />
          <TextField
          id="password"
          value={password}
          required
            onChange={(e) => setPassowrd(e.target.value)}
          sx={{ padding: "10px", width: "80%", margin: "20px 0" }}
          label="Mot de passe"
          type="password"
          variant="outlined"
        />
      

        <div className="checkBoxSection">
          <FormControlLabel
            control={
              <Checkbox
                data-testid="checkBoxTest"
                checked={checked}
                onChange={handleChange}
               
              />
            }
            label="S'inscrire à la newsletter"
          />
        </div>

        <Button
          size="large"
          sx={{ margin: "30px", backgroundColor : "#1D217C"}}
          required
          variant="contained"
          type="submit">
          {loading ? "Loading..." : "S'inscrire"}
        </Button>
      </Box>
    </div>
  );
};

export default Register;
