import { Button } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    width: "25%",
    minHeight: "20vw",
    bottom: "auto",
    marginRight: "-50%",
    padding: "30px",
    transform: "translate(-50%, -50%)",
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");

const PriceModal = ({ quote, fetchQuotes }) => {
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(quote?.totalPrice);

  const handleDiscountChange = (e) => {
    setError("");
    setDiscount(e.target.value);
    const amount = e.target.value * (quote?.totalPrice / 100);
    if (amount > Math.round(quote?.totalPrice / 2)) {
      setError("Cannot give that much discount");
    } else {
      setTotalPrice(quote?.totalPrice - Math.round(amount.toFixed(2)));
    }
  };

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
  const handleGiveDiscount = async () => {
    setError("");

    try {
      const { data } = await axios.put(`/api/quotes/discount/${quote.id}`, {
        totalPrice,
      });
      if (data?.success) {
        fetchQuotes();
        return closeModal();
      }
    } catch (error) {
      alert(error?.response.data.message || error.message);
      return setError(error.response.data.message);
    }
  };
  return (
    <div className="GiveDiscount">
      <div>
        <Button variant="contained" color="inherit" onClick={openModal} sx={{ padding: "5px" }}>
          Give Discount
        </Button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2
          ref={(_subtitle) => (subtitle = _subtitle)}
          style={{ marginBottom: "30px" }}
        >
          Give Discount
        </h2>

        {error && (
          <h5 style={{ color: "crimson", margin: "10px 5px" }}>* {error}</h5>
        )}
        <form style={{ width: "95%", margin: "auto" }}>
          <label htmlFor="">Discount</label>
          <input
            type="number"
            value={discount}
            onChange={handleDiscountChange}
            placeholder="Enter No.% to discount"
          />
          <br />
        </form>

        <h3 style={{ margin: "10px" }}>Total Price : {totalPrice} €</h3>

        <button
          style={{ padding: "5px", marginTop: "50px", marginLeft: "12px" }}
          onClick={closeModal}
        >
          Cancel
        </button>

        <button
          style={{
            padding: "5px",
            cursor: "pointer",
            marginTop: "50px",
            marginLeft: "12px",
          }}
          onClick={handleGiveDiscount}
        >
          Proceed
        </button>
      </Modal>
    </div>
  );
};

export default PriceModal;
