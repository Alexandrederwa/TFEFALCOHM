import React from "react";
import { useProducts } from "../../store";
import "./product.css";
import ProductBox from "./ProductBox";
const ProductSection = ({ searchQ }) => {
  const { products } = useProducts();
  
  return (
    <div className="productSection">
      {products?.length ? products
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
