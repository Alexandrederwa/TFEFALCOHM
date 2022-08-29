import React, { useEffect, useState } from "react";
import "./productsPage.css";
import relativeTime from "dayjs/plugin/relativeTime";
import ProductSection from "../../components/products/ProductSection";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";

const ProductsPage = () => {
    const [searchQ, setSearchQ] = useState("");
  return (
    <div className="productsPage container">
        <Typography
          gutterBottom
          variant="h3"
          sx={{ textAlign: "center", fontWeight: "bold", color : "#1D217C", marginTop : "1.5rem"}}
          component="div"
          className="titleProduct"
        >
          Découvrez notre matériel
        </Typography>
        <div className="searchContainer">
          <TextField
            id="outlined-basic"
            value={searchQ}
            sx={{width:{md:"50%",lg:"35%",xs:"80%"}}}
            onChange={(e) => setSearchQ(e.target.value)}
            label="Chercher du matériel"
            variant="outlined"
          />
        </div>
    <ProductSection searchQ={searchQ} />

    </div>
  );
}; 

export default ProductsPage;
 