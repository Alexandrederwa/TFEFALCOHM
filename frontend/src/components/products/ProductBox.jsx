import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import React from "react";
const ProductBox = ({ product }) => {
  return (
    <Card sx={{ maxWidth: 300, margin: "20px" }}>
      <CardMedia
        component="img"
        height="150"
        image={product.image}
        alt={product.name}
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h7"
          sx={{ textAlign: "center", fontWeight: "bold" }}
          className = "productBoxTitle"
          component="div"
        >
          {product.name.toUpperCase()}
        </Typography>
        <Typography gutterBottom variant="h8" component="div">
          <Typography gutterBottom variant="subtitle1" component="span">
            Catégorie :{" "}
          </Typography>
          {product.category}
        </Typography>
        {/* <Typography variant="body2" color="text.secondary">
          description 
        </Typography> */}
      </CardContent>
    </Card>
  );
};

export default ProductBox;
