import { Box, Button, TextField, Typography } from "@mui/material";

import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import { useUser } from "../../store";
import "./requestQuote.css";
const RequestQuote = () => {
  const { user } = useUser();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [party, setParty] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  console.log(user)
  const [loading, setLoading] = useState(false);
  const handleRequestQuote = async (e) => {
    e.preventDefault();
    

    try {
      setLoading(true);
      const { data } = await axios.post("/api/quotes/request", {
        name,
        email,
        party,
        phone,
      });
      if (data) {
        alert("Votre demande de devis à bien été enregistré et un résumé à été envoyé par mail, vous allez être rediriger vers votre historique de devis");
        navigate(`/my_quotes`);
      }
      setLoading(false);

    } catch (error) {
      alert("Pour accéder à cette fonctionnalitée veuillez créer un compte sur la page d'enregistrement");
      navigate(`/register`);
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
        Demande de devis
      </Typography>
      <small style={{ margin: "10px", color: "crimson" }}> {error}</small>
      {user === null && 
      <div className="createAccount">
      <small style={{ margin: "10px", color: "crimson" }}> Veuillez créer un compte avant d'accéder à cette fonctionnalitée </small> <p></p>
      <small style={{ margin: "10px", color: "crimson" }}> <a href='/register'>Je créer mon compte</a> </small>
      </div>
      }
      <Box sx={{ textAlign: "center" }}>
        <TextField
          required
          type="name"
          value={name}
          sx={{ width: "80%", margin: " 10px auto", padding: "4px" }}
          onChange={(e) => setName(e.target.value)}
          label="Nom"
        />
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <TextField
          required
          type="email"
          value={email}
          sx={{ width: "80%", margin: " 10px auto", padding: "4px" }}
          onChange={(e) => setEmail(e.target.value)}
          label="Adresse E-mail "
        />
      </Box>

      <Box sx={{ textAlign: "center" }}>
        <TextField
          required
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          value={phone}
          sx={{ width: "80%", margin: " 10px auto", padding: "4px" }}
          onChange={(e) => setPhone(e.target.value)}
          label="Numéro de téléphone"
        />
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <TextField
          required
          type="number"
          value={party}
          multiline
          rows={5}
          sx={{ width: "80%", margin: " 10px auto", padding: "4px" }}
          onChange={(e) => setParty(e.target.value)}
          label="Détails de votre événement "
        />
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          onClick={handleRequestQuote}
          sx={{backgroundColor:"#1D217C"}}
          endIcon={<SendIcon />}
        >
          {loading ? "Loading" : " Envoyer"}
        </Button>
      </Box>
    </Box>
  );
};

export default RequestQuote;
