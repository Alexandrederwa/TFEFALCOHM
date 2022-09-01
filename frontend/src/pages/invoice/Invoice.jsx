import "./invoice.css";
import { Button, ListItem, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import { saveAs } from 'file-saver';
import { BrowserRouter as Router,
    generatePath,
    Switch,
    Route,
    useHistory,
    useParams
 } from "react-router-dom";
import { useEffect } from "react";
import logoInvoice from '../../img/logoInvoice.png'
import { useMediaQuery } from 'react-responsive'

const Invoice = () => {
    const isBigScreen = useMediaQuery({ query: '(min-width: 620px)' })
    const { id } = useParams();
    const [displaybutton, setDisplayButton] = useState("inline");
    const navigate = useNavigate();
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(true);
    console.log(id);
    const printInvoice = async () => {
      setDisplayButton("none");
      //wait to delete the button from the quote+
      setTimeout(() => {
        const pdf = new jsPDF("portrait", "pt", "a4");
        const data = document.querySelector("#divToPrint");
        pdf.html(data).then(() => {
          pdf.save("invoice.pdf");
        });
      //   pdf.addHTML(data[0], function () {
      //     pdf.save('Test.pdf');
      // });
          }, "1000")
    };   
    useEffect(() => {
        // fetching quote with quote id from the url
      const timer = setTimeout(() => (console.log('Initial timeout!')), 1000);
      const getQuote = async () => {
        try {
            const { data } = await axios.get(`/api/quotes/${id}`);
            setQuote(data);

        } catch (error) {
          console.log(error.response.data.message);
          navigate("/");
        }
        setLoading(false);
      };
      getQuote();
    }, []);
    if (loading && quote === null) {
        return (
          <h1 style={{ marginTop: "30px", textAlign: "center" }}>LOADING...</h1>
        );
      }
  return (
    <div className="fontInvoice">
      <div className="invoicePage">
      <h1> Votre facture personnelle :</h1>
      </div>
      { isBigScreen ? 
    <div class="invoice-box" id="divToPrint">
    <table>
      <div className="topItems">
        <tr class="top">
          <td>
            <table className="tableOfInfo">
              <tr>
                <td class="title">
                  <img src={logoInvoice} className ='invoiceLogo' />
                </td>

                <td className="idDate">
                  Facture n°{quote.id.slice(0,7)}<br />
                  Créer le : {quote.createdAt.substring(0, 10)} <br />
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr class="information">
          <td>
            <table>
              <tr>
                <td>
                  Information du prestataire : <br></br>
                  Fal'cohm System<br />
                  Rue des croix du feu 4<br />
                  1473 Glabais <p></p>
                  BE89 0359 2561 7285
                </td>

                <td className="idDate"> 
                    Informations du client : <p></p>
                    {quote.userEmail}<br />
                    {quote.nameClient}<br />
          
                  
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </div>
      <div class="headingDiv">
      <tr class="headingInvoice">
        <td className="leftStyle">Nom</td>
        <td>Catégorie</td>
        <td>Quantité</td>
        <td>Prix unitaire</td>
        <td>Prix total</td>
      </tr>
      {quote.itemDetails.map((item) => (
      <tr className="item">
          <td className="leftStyle">
              {item.productName} 
          </td>
          <td>
              {item.productCategory} 
          </td>
          <td>
              {item.units} 
          </td>
          <td>
              {item.productPrice} €
          </td>
          <td>
              {item.productPrice * item.units} € 
          </td>
      </tr>
      ))}

      <tr class="total">
        <td className="leftStyle">Prix total : </td>
        <td></td>
        <td></td>
        <td></td>
        <td style={{paddingLeft : '0.9rem'}}>{quote.totalPrice}€</td>
      </tr>
      </div>
    </table>
    <div className="endQuote">
      Le montant à payé étant {quote.totalPrice}€, il doit être régler dans les deux semaine à venir 
      afin de reserver le matériel pour la date prévue.  <p></p>
      Le payement se fait sur le compte banquaire de l'asbl au : BE89 0359 2561 7285

    </div>
    <div style={{display : displaybutton}}>
      <Button
          variant="contained"
          color="secondary"
          sx={{ padding: "6px", marginLeft: "4px" }}
          onClick={() => printInvoice()}
      >
          Download PDF
      </Button>
    </div>
  
    </div>
    :
    <div className="mobileVersionInvoice">
      Malheureusement, la génération de facture via le site n'est pas disponible sur téléphone. 
      Veuillez consulter le site avec un ordinateur ou une tablette afin d'avoir accès à votre facture au format PDF! 
      Merci de votre confiance,
      Falc'ohm System
    </div>

      }


          </div>
          
  );
};

export default Invoice;
