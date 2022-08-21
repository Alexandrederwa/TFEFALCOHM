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
    width: "30%",
    minHeight: "30vw",
    bottom: "auto",
    marginRight: "-50%",
    padding: "30px",
    transform: "translate(-50%, -50%)",
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");

const ChangePassword = () => {
  const { setUser } = useUser();
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
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
  const handleChangePassword = async () => {
    setError("");
    if (oldPassword === newPassword) {
      return setError("old and new Emails cannot be same");
    }
    try {
      const { data } = await axios.put("/api/auth/change_password", {
        newPassword,
        oldPassword,
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
    <div className="changePassword">
      <div style={{ margin: "10px auto", width: "50%", padding: "5px" }}>
        <Button variant="contained" color="primary" onClick={openModal}>
          Changer de mot de passe 
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
             textAlign:"center"
             
            }}
          >
            Changer de mot de passe 
          </Typography>

        {error && (
          <h5 style={{ color: "crimson", margin: "10px 5px" }}>* {error}</h5>
        )}
        <form style={{ width: "95%", margin: "auto" }}>
          <TextField
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            sx={{ margin: " 5px auto",width:"100%", padding: "4px" }}
            label="Ancien mot de passe"
          />
          <br />

        
           <TextField
           type="password"
           value={newPassword}

           onChange={(e) => setNewPassword(e.target.value)}
            sx={{ margin: " 5px auto",width:"100%", padding: "4px" }}
            label="Nouveau mot de passe"
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
          onClick={handleChangePassword}
        >
                   Confirmer

        </Button>
      </Modal>
    </div>
  );
};

export default ChangePassword;
