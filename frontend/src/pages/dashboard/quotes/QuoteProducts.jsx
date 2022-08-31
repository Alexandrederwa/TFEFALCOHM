import React, { useState } from "react";
import { Button, TableCell, TableRow, TextField } from "@mui/material";
import axios from "axios";
const QuoteProducts = ({ item, quote, fetchQuotes, setShowProducts }) => {
  const [units, setUnits] = useState(item?.units);
  const [editLoading, setEditLoading] = useState(false);
  const [removeLoading, setremoveLoading] = useState(false);

  const handleRemoveProduct = async () => {
    setremoveLoading(true);
    try {
      const { data } = await axios.put(`/api/quotes/item/${item.id}`, {
        remove: true,
        quoteId: quote.id,
        units,
      });
      if (data.success) {
        setShowProducts(false);
        fetchQuotes();
      }
      setremoveLoading(false);
    } catch (error) {
      alert(error?.response.data.message);
      setremoveLoading(false);
    }
  };
  const handleUpdateProduct = async () => {
    setEditLoading(true);
    const { data: products } = await axios.get("/api/products/all");
    const { stock, reserved } = products?.find(
      (prod) => prod.id === item.productId
    );

    if (units > stock - JSON.parse(reserved).length) {
      setEditLoading(false);

      return alert("Il n'y a pas assez de stock disponible");
    }
    try {
      if (units === item.units) {
        setEditLoading(false);

        return alert("Change items quantity");
      }

      const { data } = await axios.put(`/api/quotes/item/${item.id}`, {
        remove: false,
        quoteId: quote.id,
        units,
      });
      console.log({ data });
      if (data) {
      
        setEditLoading(false);

        return fetchQuotes();
      }
    } catch (error) {
      console.log(error.message);
      alert('Veuillez choisir un nombre valable et au dessus du nombre déjà réservé')
      return setEditLoading(false);
    }
  };
  return (
    <TableRow>
      <TableCell style={{ textAlign: "center" }}>
        <img
          src={item.productImage}
          alt={item.productName}
          width={120}
          height={80}
        />
      </TableCell>
      <TableCell style={{ textAlign: "center" }}>{item.productName}</TableCell>
      <TableCell style={{ textAlign: "center" }}>
        {item.productPrice} €
      </TableCell>
      <TableCell style={{ textAlign: "center" }}>
        {quote.userDecision !== "rejected" && quote.status !== "rejected" ? (
          <TextField
            id="outlined-number"
            label="Units"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            name="units"
            sx={{ width: "35%", padding: "5px" }}
            value={units}
            onChange={(e) => setUnits(e.target.value)}
          />
        ) : (
          item.units
        )}
      </TableCell>
      <TableCell style={{ textAlign: "center" }}>
        {item.productCategory}
      </TableCell>
      <TableCell style={{ textAlign: "center" }}>
        {new Date(item.rentDate).toLocaleDateString()}
      </TableCell>
      <TableCell style={{ textAlign: "center" }}>
        {new Date(item.deliverDate).toLocaleDateString()}
      </TableCell>
      {quote.userDecision !== "rejected" &&
      quote.status !== "rejected" &&
      quote.status !== "accepted" ? (
        <TableCell style={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="success"
            sx={{ padding: "6px", marginRight: "20px" }}
            onClick={handleUpdateProduct}
            disabled={units === item.units || editLoading}
          >
            {editLoading ? "Mise à jour..." : "Mettre à jour"}
          </Button>
          <Button
            variant="contained"
            color="error"
            style={{ padding: "6px", marginLeft: "20px" }}
            onClick={handleRemoveProduct}
            disabled={removeLoading}
          >
            {removeLoading ? "Suppression..." : "Supprimer l'article"}
          </Button>
        </TableCell>
      ) : null}
    </TableRow>
  );
};

export default QuoteProducts;
