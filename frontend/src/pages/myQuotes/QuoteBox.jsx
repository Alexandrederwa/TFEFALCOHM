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
        <b>Action en cours :  : </b>
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
      {/* <small>
        {" "}
        <b>Request By : </b> {quote.userEmail}
      </small> */}
      <small>
        {" "}
        <b>Nombre de produits : </b> {quote.itemDetails?.length}
      </small>
      <small>
        {" "}
        <b>Nombre d'article : </b> {quote.totalReserved}
      </small>
      {quote.status !== "asked" ? (
        <small>
          {" "}
          <b>Prix total: </b> ${quote.totalPrice}
        </small>
      ) : null}
      {(quote.userDecision === "pending" ||
        quote.userDecision === "askDiscount") &&
      quote.status !== "asked"
        ? <button style={{padding:"6px",background:"crimson",color:"#fff",border:"none",cursor:"pointer"}} onClick={()=>navigate(("/quote?quoteId="+quote.id))}>Action</button>
        : null}
      {(quote.userDecision === "accepted") &&
      quote.status !== "asked"
        ? <button style={{padding:"6px",background:"crimson",color:"#fff",border:"none",cursor:"pointer"}} onClick={()=>navigate(("/quote/" + quote.id))}>Facture</button>
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
              <b>Nom : </b> {item.productName}
            </small>
            <small>
              <b>Prix : </b> ${item.productPrice}
            </small>
            <small>
              <b>Catégorie : </b> {item.productCategory}
            </small>
            <small>
              <b>Unités : </b> {item.units}
            </small>
            
            {quote.status !== "asked" && quote.status !== "rejected" ? (
              <>
                <small>
                  <b>Début de l'événement : </b> {startDate}
                </small>
                <small>
                  <b>Fin de l'événement : </b> {endDate}
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
