import React from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
dayjs().format();
const QuoteBox = ({ quote }) => {
  const startDate = dayjs(quote.rentDate).format("DD/MM/YYYY");
  const endDate = dayjs(quote.deliverDate).format("DD/MM/YYYY");
  const navigate = useNavigate();
  return (
    <div className="quoteBox">
      <div className="quoteDetails">
     
      <small>
        {" "}
        <b>Quote Status : </b>
        <i
          style={{
            color:
              quote.status === "asked"
                ? "goldenrod"
                : quote.status === "sent"
                ? "blueviolet"
                : quote.status === "accepted"
                ? "green"
                : "red",
          }}
        >
          {" "}
          {quote.status.toUpperCase()}
        </i>
      </small>
      <small>
        {" "}
        <b>Request By : </b> {quote.userEmail}
      </small>
      <small>
        {" "}
        <b>No of Products : </b> {quote.itemDetails?.length}
      </small>
      <small>
        {" "}
        <b>No of Items : </b> {quote.totalReserved}
      </small>
      {quote.status !== "asked" ? (
        <small>
          {" "}
          <b>Total Price: </b> ${quote.totalPrice}
        </small>
      ) : null}
      {(quote.userDecision === "pending" ||
        quote.userDecision === "askDiscount") &&
      quote.status !== "asked"
        ? <button style={{padding:"6px",background:"crimson",color:"#fff",border:"none",cursor:"pointer"}} onClick={()=>navigate(("/quote?quoteId="+quote.id))}>Action</button>
        : null}
      {(quote.userDecision === "accepted") &&
      quote.status !== "asked"
        ? <button style={{padding:"6px",background:"crimson",color:"#fff",border:"none",cursor:"pointer"}} onClick={()=>navigate(("/quote/" + quote.id))}>Invoice</button>
        : null}
      </div> 

      <div className="itemBoxWrapper">
        {quote.itemDetails.map((item) => (
          <div className="itemBox" key={item.productId}>
            <img
              src={item.productImage}
              style={{ margin: "5px" }}
              alt={item.productName}
              width={85}
              height={60}
            />
            <small>
              <b>Name : </b> {item.productName}
            </small>
            <small>
              <b>Price : </b> ${item.productPrice}
            </small>
            <small>
              <b>Category : </b> {item.productCategory}
            </small>
            <small>
              <b>Units : </b> {item.units}
            </small>
            
            {quote.status !== "asked" && quote.status !== "rejected" ? (
              <>
                <small>
                  <b>StartDate : </b> {startDate}
                </small>
                <small>
                  <b>EndDate : </b> {endDate}
                </small>
              </>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuoteBox;
