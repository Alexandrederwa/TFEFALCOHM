import { css } from "@emotion/react";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {  useNavigate, useSearchParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useItemsList, useProducts } from "../../store";
import "./itemList.css";
import ItemsListBox from "./ItemsListBox";

const override = css`
  display: block;
  margin: 10% auto;
  border-color: crimson;
`;

const ItemListSection = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  
  const navigate = useNavigate();
  const { itemsList, emptyItemsList } = useItemsList();

  const { products, setProducts } = useProducts();

  const [totalPrice, setTotalPrice] = useState(0);
  const [searchQ, setSearchQ] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [error, setError] = useState("");
  // ADMIN SEND QUOTE
  const handleSubmit = async () => {
    setError("");
    if (!itemsList[0]?.endDate) {
      return setError("Provide Select Products.");
    }

    try {
      setSubmitLoading(true);
      const { data } = await axios.put(`quotes/add_items/${id}`, {
        itemsList,
        totalPrice,
      });
      if (data) {
        setError("");
        emptyItemsList();
        setSubmitLoading(false);
        navigate("/dashboard/quotes");
      }
    } catch (error) {
      console.log(error?.message);

      console.log(error?.response.data.message);
      setError(error?.response.data.message);
      setSubmitLoading(false);
    }
  };
  // ADMIN Create QUOTE
  const handleAdminAddQuote = async (e) => {
    e.preventDefault();
  
    try {
      setSubmitLoading(true);
      const { data } = await axios.post("quotes/request", {
        name,
        email,
        phone,
        itemsList,
        totalPrice
      });
      if (data) {

        setError("");
        emptyItemsList();
        setSubmitLoading(false);
        navigate(`/`);
      }
    } catch (error) {
      alert(error?.message);
      setError(error?.response.data.message);
      setSubmitLoading(false);
      console.log(error?.response.data.message);
    }
  };
  const emptyCart = () => {
    setError("");
    emptyItemsList();
    setTotalPrice(0);
  };


  const fetchQuotes = async () => {
    setLoading(true); 
    try {
      const { data } = await axios.get("quotes/" + id);
      if (data) {
        setQuote(data);
      }
      setLoading(false);
    } catch (error) {
      alert(error?.response.data.message);
      setLoading(false);
    }
  };
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/products/all");
      if (data) {
        setProducts(data);
      }
      setLoading(false);
    } catch (error) {
      alert(error?.response.data.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
    if(id) {
      fetchQuotes();
    }  
    // eslint-disable-next-line
  }, [searchParams]);

  if (loading)
    return (
      <ClipLoader color={"red"} loading={loading} css={override} size={60} />
    );
  return (
    <div className="itemsListSection">
      <div className="itemsDetail">
        <Typography
          gutterBottom
          variant="h4"
          sx={{ textAlign: "center", fontWeight: "bold" }}
          component="div"
        >
          Details
        </Typography>
        <small style={{ margin: "10px", color: "crimson" }}> {error}</small>
        <p></p>
        {quote && id ? (
          <div>
            <p>
              <b>Customer Mail :</b> {quote?.userEmail}
            </p>
            <p>
              <b>Party :</b> {quote?.party}
            </p>
            <p>
              <b>Phone :</b> {quote?.phone}
            </p>
          </div>
        ) : (
          <Box
            component="div"
            sx={{
              m: 1,

              margin: "auto",
            }}
            noValidate
            autoComplete="off"
          >
            <Box sx={{ textAlign: "center" }}>
              <TextField
                required
                value={name}
                sx={{ margin: " 5px auto", padding: "4px" }}
                onChange={(e) => setName(e.target.value)}
                label="Name "
              />
            </Box>
            
            <Box sx={{ textAlign: "center" }}>
              <TextField
                required
                type="email"
                value={email}
                sx={{ margin: " 5px auto", padding: "4px" }}
                onChange={(e) => setEmail(e.target.value)}
                label="Email"
              />
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <TextField
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                value={phone}
                sx={{ margin: " 5px auto", padding: "4px" }}
                onChange={(e) => setPhone(e.target.value)}
                label="Phone number"
              />
            </Box>
          </Box>
        )}
        <b>TotalPrice :</b> ${totalPrice}
        <br />
        <Button
          variant="contained"
          onClick={quote && id  ? handleSubmit : handleAdminAddQuote}
          sx={{ margin: "8px" }}
          color="warning"
          disabled={!itemsList[0]?.endDate}
        >
          {submitLoading ? "loading" : " Send Quote"}
        </Button>
      </div>
      {itemsList?.length ? (
        <small
          style={{
            textAlign: "left",
            color: "red",
            marginRight: "auto",
            marginLeft: "100px",
            marginTop: "20px",
            cursor: "pointer",
          }}
          onClick={emptyCart}
        >
          Empty Saved List
        </small>
      ) : null}
      <div className="searchContainer">
        <TextField
          id="outlined-basic"
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
          label="Search Products"
          variant="outlined"
        />
      </div>
      <div className="itemsBoxList">
        {products?.length ? (
          products
            .filter((val) => {
              const query = searchQ.trim().toLowerCase();
              let returnValue = false;

              if (query.length === "") {
                returnValue = false;
              } else if (
                val.name.toLowerCase().includes(query) ||
                val.category.toLowerCase().includes(query)
              ) {
                returnValue = true;
              }
              return returnValue;
            })
            .map((item) => (
              <ItemsListBox
                key={item.id}
                item={item}
                setTotalPrice={setTotalPrice}
                totalPrice={totalPrice}
              />
            ))
        ) : (
          <h1
            style={{ marginTop: "30px", fontSize: "50px", textAlign: "center" }}
          >
            No Products Found
          </h1>
        )}
      </div>
    </div>
  );
};

export default ItemListSection;
