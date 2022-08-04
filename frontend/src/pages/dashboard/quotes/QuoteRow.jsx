import { Button, TableCell, TableRow } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useId, useState } from "react";
import PriceModal from "./PriceModal";
import { Link } from "react-router-dom";
import QuoteProducts from "./QuoteProducts";



dayjs.extend(relativeTime);
const QuoteRow = ({ quote, handleDeleteQuote, fetchQuotes, loading }) => {
  const [showProducts, setShowProducts] = useState(false);
  const id = useId();
  
  return (
    <>
      <TableRow
        style={{ backgroundColor: showProducts ? "#97d0e5" : "#74dd6e" }}
        data-testid="details"
        key={quote.id}
      >
        <TableCell style={{ textAlign: "center" }}>
          {quote?.userEmail}
        </TableCell>
        
        <TableCell style={{ textAlign: "center" }}>
          {JSON.stringify(quote?.emailRegistered)}
        </TableCell>
        <TableCell
          style={{
            textAlign: "center",
            color: quote?.userDecision === "rejected" ? "red" : null,
          }}
        >
          {quote?.userDecision.toUpperCase()}
        </TableCell>
        <TableCell
          style={{
            textAlign: "center",
            color:
              quote?.status === "rejected"
                ? "red"
                : quote?.status === "discounted"
                ? "blue"
                : "",
          }}
        >
          {quote?.status.toUpperCase()}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {quote?.totalPrice ? (
            "$" + quote?.totalPrice
          ) : (
            <small>Yet to give a quote </small>
          )}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {quote?.totalReserved}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {dayjs().from(quote.createdAt, true)} ago
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
            variant="contained"
            color="error"
            disabled={loading}
            sx={{ padding: "6px", marginLeft: "4px" }}
            onClick={() => handleDeleteQuote(quote.id)}
          >
            Delete{" "}
          </Button>
          
          {quote.itemDetails?.length ? (
            //button adaptable for show product
            
            <Button
              variant="contained"
              color="secondary"
              disabled={loading}
              sx={{ padding: "6px", marginLeft: "4px" }}
              onClick={() => setShowProducts((val) => !val)}
            >
              {showProducts ? "Hide " : "Show "} Products
            </Button>
          ) : null}

          {quote.itemDetails?.length && 
          quote.status === "accepted" ? (
            //button adaptable for download pdf when quote is accepted 
            
            <Button
            variant="contained"
            color="primary"
            component={Link}
            disabled={loading}
            to={"/quote/" + quote.id}
            sx={{ padding: "4px", marginLeft: "4px" }}
            >
              Invoice
            </Button>
          ) : null}
          {quote.status === "asked" &&
          quote.status !== "rejected" &&
          quote.userDecision !== "accepted" &&
          quote.userDecision !== "rejected" ? (
            // <Link to={"/items_list?id=" + quote.id}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              disabled={loading}
              to={"/items_list?id=" + quote.id}
              sx={{ padding: "4px", marginLeft: "4px" }}
            >
              Create Quote
            </Button>
          ) : // </Link>
          quote.userDecision === "askDiscount" &&
            quote.status !== "discounted" ? (
            <PriceModal quote={quote} fetchQuotes={fetchQuotes} />
          ) : null}
        </TableCell>
      </TableRow>
      {showProducts && (
        <TableRow
          style={{
            backgroundColor: "#eadd4d",
            color: "#fff",
            padding: "10px",
          }}
        >
          <TableCell style={{ textAlign: "center" }}>Image</TableCell>
          <TableCell style={{ textAlign: "center" }}>Name</TableCell>

          <TableCell style={{ textAlign: "center" }}>Price</TableCell>
          <TableCell style={{ textAlign: "center" }}>Units</TableCell>

          <TableCell style={{ textAlign: "center" }}>Category</TableCell>
          <TableCell style={{ textAlign: "center" }}>Rent Start</TableCell>
          <TableCell style={{ textAlign: "center" }}>Rent Deliver</TableCell>
          {quote.userDecision !== "rejected" && quote.status !== "rejected" ? (
            <TableCell style={{ textAlign: "center" }}>Actions</TableCell>
          ) : null}
        </TableRow>
      )}
      {showProducts && quote.itemDetails?.length
        ? quote.itemDetails.map((item) => (
            <QuoteProducts
              setShowProducts={setShowProducts}
              fetchQuotes={fetchQuotes}
              quote={quote}
              key={item.id + id}
              item={item}
            />
          ))
        : null}
        
    </>
    
  );
};

export default QuoteRow;
