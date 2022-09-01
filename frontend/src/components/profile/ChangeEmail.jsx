import { Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import Modal from "react-modal";
import { useUser } from "../../store";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    width: "80%",
    minHeight: "30vw",
    bottom: "auto",
    marginRight: "-50%",
    padding: "30px",
    transform: "translate(-50%, -50%)",
  },
};
//Verif check
Modal.setAppElement("#root");

const ChangeEmail = () => {
  const { setUser } = useUser();
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [oldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.marginTop = "20px";
    subtitle.style.marginBotton = "20px";
  }

  function closeModal() {
    setIsOpen(false);
  }
  const handleChangeEmail = async () => {
    setError("");
    if (oldEmail === newEmail) {
      return setError("La nouvelle adresse email ne peut pas être la même que l'ancienne");
    }
    try {
      const { data } = await axios.put("/api/auth/change_email", {
        newEmail,
        oldEmail,
      });
    
      if (data) {
        setUser(data);
        return closeModal();
      }
    } catch (error) {
      return setError(error.response.data.message);
    }
  };
  return (
    <div className="changeEmail">
      <div style={{ margin: "10px auto", width: "70%", padding: "5px" }}>
        
        <Button
          variant="contained"
        
          sx={{ margin: "8px", backgroundColor :"#1D217C" }}
          onClick={openModal} 
        >
          Changer d'adresse email
        </Button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
       <Typography
            variant="h5"
           
            sx={{
              m: 2,
              fontWeight:"bold",
             textAlign:"center",
             width : "90%"
            }}
          >
           Changer d'adresse email
          </Typography>

        {error && (
          <h5 style={{ color: "crimson", margin: "10px 5px" }}>* {error}</h5>
        )}
        <form style={{ width: "95%", margin: "auto" }}>
        <TextField
            type="email"
            value={oldEmail}
            onChange={(e) => setOldEmail(e.target.value)}
            sx={{ margin: " 5px auto",width:"100%", padding: "4px" }}
            label="Ancienne adresse E-mail"
          />
          <br />

        
           <TextField
           type="email"
           value={newEmail}

           onChange={(e) => setNewEmail(e.target.value)}
            sx={{ margin: " 5px auto",width:"100%", padding: "4px" }}
            label="Nouvelle adresse E-mail"
          />
        </form>
        <Button
          variant="outlined"
        
          sx={{ margin: "8px",marginLeft:"20px" }}
          color="inherit"
          onClick={closeModal}
        >
                   Annuler

        </Button>

        
        <Button
          variant="outlined"
          sx={{ margin: "8px" }}
          color="primary"
          onClick={handleChangeEmail}
        >
                   Confirmer

        </Button>
      </Modal>
    </div>
  );
};

export default ChangeEmail;
