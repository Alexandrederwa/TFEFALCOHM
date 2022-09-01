import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../../store";
import "./quotePage.css";
import dayjs from "dayjs";
dayjs().format();
const QuotePage = () => {
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const quoteId = searchParams.get("quoteId");
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(quoteId)
  console.log("fdhjkslgfdslkgfksdhfljqshflhlfhsdZZZZZ")
  // If the email is registered then the user will be redirected to login page else register
  const goFurther = () => {
    navigate(!quote?.emailRegistered ? "/register" : "/login", {
      state: { quoteId, email: quote.userEmail },
    });
  };
  // ACtion to accept or reject a quote
  const handleUserQuoteAction = async (decision) => {
    try {
      const { data } = await axios.put(`/api/quotes/user_quote/${quoteId}`, {
        decision,
      });
      if (data.success) {
        alert(`Merci d'avoir ${decision} le devis`)
        navigate("/");
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  // When user email open the quote sent email if he is not loged in he will have to login
  const ifNotAuthenticated = () => {
    return (
      <>
        {quote?.emailRegistered ? (
          <button className="actionBtn" onClick={goFurther}>
            Connecte-toi afin de donner ta réponse!
          </button>
        ) : (
          <button className="actionBtn" onClick={goFurther}>
            Enregistre toi afin de donner ta réponse!
          </button>
        )}
      </>
    );
  };
  const startDate = dayjs(quote?.rentDate).format("DD/MM/YYYY");
  const endDate = dayjs(quote?.deliverDate).format("DD/MM/YYYY");
  useEffect(() => {
	  // fetching quote with quote id from the url
    const getQuote = async () => {
      try {
        const { data } = await axios.get(`/api/quotes/${quoteId}`);
        if (data) {
			// Checking if user already took these action then redirect to home page
          if (
            data?.userDecision === "rejected" ||
            data?.status === "rejected"
          ) {
            navigate("/");
          }
          setQuote(data);
        }
      } catch (error) {
        console.log(error.response.data.message);
        navigate("/");
      }
      setLoading(false);
    };
    getQuote();
    // eslint-disable-next-line
  }, []);

  if (loading && !quote) {
    return (
      <h1 style={{ marginTop: "30px", textAlign: "center" }}>LOADING...</h1>
    );
  }

  return (
    <div className="quoteSection">
      <h1 className="heading">Devis</h1>
      <ul style={{ listStyle: "none" }}>
        <li>
          <b>Prix total : {quote.totalPrice}€</b>
        </li>
        <li>
          <b>Nombre d'articles : </b>
          {quote.totalReserved}
        </li>
        <li>
          <b>Nombre de produits : {quote.itemDetails.length}</b>
        </li>
        {/* <li>
          <b>Demandé par : </b>
          {quote.userEmail}
        </li> */}
      </ul>
      {quote?.itemDetails.map((item) => (
        <div className="itemBox" key={item.productId}>
          <img
            src={item.productImage}
            style={{ margin: "5px" }}
            alt={item.productName}
            width={85}
            height={60}
          />
          <small>
            <b>Nom du matériel : </b> {item.productName}
          </small>
          <small>
            <b>Prix : </b> {item.productPrice}€
          </small>
          <small>
              <b>Catégorie : </b> {item.productCategory}
            </small>
          <small>
            <b>Unités : </b> {item.units}
          </small>
          <br />
          {quote.status !== "asked" && quote.status !== "rejected" ? (
            <>
              <small>
                <b>Début de l'événement  : </b> {startDate}
              </small>
              <small>
                <b>Fin de l'événement  : </b> {endDate}
              </small>
            </>
          ) : null}
        </div>
      ))}
      <br />
      {!user ? (
        ifNotAuthenticated()
      ) : (
        <div className="buttonGroup">
          <button
            className="actionBtn"
            onClick={() => handleUserQuoteAction("accepted")}
            style={{
              display: "block",
              backgroundColor: "seagreen",
              padding: "8px",
            }}
          >
            Accepter le devis
          </button>
          <button
            style={{
              display: "block",
              backgroundColor: "crimson",
              padding: "8px",
              color: "#fff",
            }}
            className="actionBtn"
            onClick={() => handleUserQuoteAction("rejected")}
          >
            Refuser le devis
          </button>
          {quote.userDecision !== "askDiscount" && (
            <button
              style={{
                display: "block",
                backgroundColor: "crimson",
                padding: "8px",
              }}
              className="actionBtn"
              onClick={() => handleUserQuoteAction("askDiscount")}
            >
              Demander une réduction sur le devis
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default QuotePage;
