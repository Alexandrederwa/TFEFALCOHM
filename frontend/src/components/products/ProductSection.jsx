import React from "react";
import { useProducts } from "../../store";
import "./product.css";
import ProductBox from "./ProductBox";
import { useState } from "react";
import { Button } from "@mui/material";
import { useEffect } from "react";
const ProductSection = ({ searchQ , isPage}) => {
  const { products } = useProducts();
  const [show, setShow] = useState(false);
  const [sliced, setSliced] = useState(products);
  console.log(isPage)
  useEffect(() =>{
    if (isPage === false){
      if (products.length < 9) {
        setSliced(products);
      }else{
        setShow(true); // Show button
        setSliced(products.slice(0,10));
      }
    }
  },[products])
  
  return (
    <div className="productSection">
      {products?.length ? sliced
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
        )) : <h1 style={{marginTop:"30px",fontSize:"50px",textAlign:"center"}}>No Products are  Available</h1>}
        
    </div>
  );
};

export default ProductSection;
