import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductSection from "../../components/products/ProductSection";
import { useProducts } from "../../store";
import TextField from "@mui/material/TextField";
import "./home.css";
import { Typography } from "@mui/material";
const Home = () => {
  const { setProducts, products } = useProducts();
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("products/all");
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.log(error.response.data.message);
        setLoading(false);
      }
    };
    fetchProducts();
    // eslint-disable-next-line
  }, []);
  if (loading && !products.length)
    return (
      <h1 style={{ margin: "30px auto", textAlign: "center" }}>LOADING</h1>
    );
  return (
    <div className="homePage">
      <Typography
        gutterBottom
        variant="h3"
        sx={{ textAlign: "center", fontWeight: "bold" }}
        component="div"
      >
        Products
      </Typography>
      <div className="searchContainer">
        <TextField
          id="outlined-basic"
          value={searchQ}
          sx={{width:{md:"50%",lg:"35%",xs:"80%"}}}
          onChange={(e) => setSearchQ(e.target.value)}
          label="Search Products"
          variant="outlined"
        />
      </div>
      <ProductSection searchQ={searchQ} />
    </div>
  );
};

export default Home;
