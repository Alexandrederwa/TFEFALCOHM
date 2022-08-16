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

const Invoice = () => {

    const { id } = useParams();
    const [displaybutton, setDisplayButton] = useState("inline");
    const navigate = useNavigate();
    const [quote, setQuote] = useState(null);
    const [totalprice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    console.log(id);



    const printInvoice = () => {
        setDisplayButton("none");
        setTimeout(() => {
            console.log("PDF is preparing mettre un toast");
            const input = document.getElementById('divToPrint')
            var w = input.offsetWidth;
            var h = input.offsetHeight;
            html2canvas(input, {
            dpi: 300, // Set to 300 DPI
            scale: 3, // Adjusts your resolution
           }).then((canvas) => {
            var img = canvas.toDataURL("image/jpeg", 1);
            var doc = new jsPDF('L', 'px', [w, h]);
            doc.addImage(img, 'JPEG', 0, 0, w, h);
            doc.save('sample-file.pdf');
           }) 
          }, "3000")

            
          };
        
        // html2canvas(input)
        //   .then((canvas)=> {
            // canvas.toBlob(function(blob) {
            //     saveAs(blob, "pretty image.png");
            // });
            // var myImage = canvas.toDataURL("image/jpeg,1.0");
            // Adjust width and height
            // var imgWidth =  (canvas.width * 60) / 240;
            // var imgHeight = (canvas.height * 70) / 240;
            // jspdf changes
            // var pdf = new jsPDF('p', 'px', 'a4');
            // pdf.addImage(myImage, 'png', 0, 0, imgWidth, imgHeight); // 2: 19
            // pdf.save(`test.pdf`);
            // var doc = new jsPDF("p", "mm", "a4");
            // const pdf = new jsPDF();
            // console.log(windowSize.innerWidth , windowSize.innerHeight)
            // var width = doc.internal.pageSize.getWidth();
            // var height = doc.internal.pageSize.getHeight();
            // pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
            // pdf.save("download.pdf");
    //       })
    //   }
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
    const priceCalculation = () => {
        const obj = quote.itemDetails;
        console.log(obj)
        const len = obj.lenght;
        var index = 0;
        var totalPriceCalc = 0;
        for (index = 0, index <= len; index++;){
            totalPriceCalc += obj[index].productPrice * obj[index].units
        }
        // infinity load to be fixed
        // setTotalPrice(totalPriceCalc)
    }
  return (
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
                        Invoice #{quote.id}<br />
                        Created: {quote.createdAt.substring(0, 10)} <br />
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
                        Fal'cohm System<br />
                        Rue des croix du feu 4<br />
                        1473 Glabais
                        BE89 0359 2561 7285
                      </td>

                      <td className="idDate">
                          {quote.userEmail}<br />
                          {quote.phone}<br />
                        
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </div>
            <tr class="heading">
              <td>Name</td>
              <td>Category</td>
              <td>Quantity</td>
              <td>Unit price</td>
              <td>Total</td>
            </tr>
            {quote.itemDetails.map((item) => (
            <tr className="item">
                <td>
                    {item.productName} 
                </td>
                <td>
                    {item.productCategory} 
                </td>
                <td>
                    {item.units} 
                </td>
                <td>
                    {item.productPrice} 
                </td>
                <td>
                    {item.productPrice * item.units} 
                </td>
            </tr>
            ))}

            <tr class="total">
              <td></td>

              <td>{priceCalculation()}</td>
            </tr>
          </table>
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
          
  );
};

export default Invoice;
