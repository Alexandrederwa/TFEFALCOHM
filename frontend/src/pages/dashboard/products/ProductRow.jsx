import { Button, TableCell, TableRow } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
dayjs.extend(relativeTime);
const ProductRow = ({
  product,
  handleDeleteProduct,
  loading,
  handleEditProduct,
}) => {
  return (
    <TableRow data-testid="details" key={product.id}>
      <TableCell style={{ textAlign: "center" }}>{product?.name}</TableCell>
      <TableCell style={{ textAlign: "center" }}>{product?.category}</TableCell>
      <TableCell style={{ textAlign: "center" }}>€{product?.price}</TableCell>
      <TableCell style={{ textAlign: "center" }}>{product?.stock}</TableCell>
      <TableCell style={{ textAlign: "center" }}>
        {dayjs().from(product.createdAt, true)} 
      </TableCell>
      <TableCell style={{ textAlign: "center" }}>
        {dayjs().from(product.updatedAt, true)} 
      </TableCell>
      <TableCell
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Button
          size="small"
          variant="contained"
          color="error"
          onClick={() => handleDeleteProduct(product.id)}
          disabled={loading}
          sx={{ padding: "6px", marginLeft: "2px" }}
        >
          Delete{" "}
        </Button>
        <Button
          size="small"
          variant="contained"
          color="info"
          onClick={() => handleEditProduct(product)}
          disabled={loading}
          sx={{ padding: "6px", marginLeft: "2px" }}
        >
          Edit{" "}
        </Button>
        
      </TableCell>
    </TableRow>
  );
};

export default ProductRow;
