import React from "react";
import { useProducts } from "../../store";
import "./product.css";
import ProductBox from "./ProductBox";
import { useState } from "react";
import { Button } from "@mui/material";
const ProductSection = ({ searchQ }) => {
  const { products } = useProducts();
  const [show, setShow] = useState(false);
  
  return (
    <div className="productSection">
      {products.length < 10 ? products
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
        .map((prod) => (
          <ProductBox key={prod.id} product={prod} />
        )) : products
        .slice(0,10).filter((val) => {
          setShow(true)
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
        .map((prod) => (
          <ProductBox key={prod.id} product={prod} />
        ))}
        {/* {show === true && 
          <Button
          variant="contained"
          className="buttonMore"
          >
            Voir la liste entière (redirect ou afficher tout le matos)
          </Button>
        } */}
        
    </div>
  );
};

export default ProductSection;
