import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductSection from "../../components/products/ProductSection";
import { useProducts } from "../../store";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import "./home.css";
import { Typography } from "@mui/material";
import { Button, TableCell, TableRow } from "@mui/material";
import { Link } from "react-router-dom";
import { color } from "@mui/system";
import SendIcon from "@mui/icons-material/Send";
import { useUser } from "../../store";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive'
import Typewriter from "typewriter-effect";

const Home = () => {
  const { setProducts, products } = useProducts();
  const { user } = useUser();
  const [show, setShow] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [detail, setDetail] = useState("");
  const [count, setCount] = useState(1);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  const [isPage, setIsPage] = useState(false);
  const isBigScreen = useMediaQuery({ query: '(min-width: 769px)' })
  const handleSendMessage = async (e) => {
    if(isValidEmail(email)){
      if (isValidNumber(phone)){
        try {
          setLoading(true);
          const { data } = await axios.post("api/quotes/contact", {
            name,
            email,
            phone,
            detail,
          });
          alert("Merci de nous avoir envoyé un message, un expert de chez falc'ohm system reviendra vers vous au plus vite!")
          setLoading(false);
          setName("");
          setEmail("");
          setPhone("");
          setDetail("");
    
        } catch (error) {
          alert("Veuillez remplir le formulaire au complet");
          setError(error?.response.data.message);
          setLoading(false);
          console.log(error?.response.data.message);
        }
      }else{
        alert("Please entry a valid phone number")
      }
    }else{
      alert("Veuillez entrer une adresse email valable")
    }
  };
  //form input verification 
  const isValidEmail = (emailInput) =>{
    return /\S+@\S+\.\S+/.test(email);
  }
  const isValidNumber = (numberInput) =>{
    if (numberInput === ""){
      return true
    }else{
      try {
        parseInt(numberInput);
        return true
      } catch (error) {
        alert("Veuillez écrire un numéro de téléphone valide")
      }
    }

    
  }
  useEffect(() => {
    // setTimeout(() => {
    //   setCount((count) => count + 1);
    // }, 1000);
    if (products.length >= 10){
      setShow(true)
    }
  }, [products]); // <- add empty brackets here
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("/api/products/all");
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.log(error.response.data.message);
        setLoading(false);
      }
    };
    fetchProducts();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    // document.title = `You clicked ${count} times`;
    console.log("Count: " + count);
    setCount(1);
  }, [count]);
  // if (loading && !products.length)
  //   return (
  //     <h1 style={{ margin: "30px auto", textAlign: "center" }}>LOADING</h1>
  //   );
  return (
    <div className="homePage">
      {/* Big picture */}
      {isBigScreen ?  
      <Box 
              component="img"
              src= "https://res.cloudinary.com/dutkkgjm5/image/upload/v1660060391/sound_htbfif.webp"
              className="homePicture"
              alt="homePicture"
              
              >
                
      </Box> :
      <Box 
      component="img"
      src= "https://res.cloudinary.com/dutkkgjm5/image/upload/v1659800229/296873810_745709496541099_8575950716506421386_n_tsjiav.jpg"
      className="homePictureMobile"
      alt="homePictureMobile"
      
      >
        
        </Box>
      
      }
      {/* {isLittleScreen === true &&  
      <Box 
      component="img"
      src= "https://res.cloudinary.com/dutkkgjm5/image/upload/v1660060391/sound_htbfif.webp"
      className="homePicture"
      alt="homePicture"
      
      >
        
        </Box>
      } */}
      <div className="centered"> 
         Falc'ohm System,
        <Typewriter 
            options={{
              strings: [
                "votre partenaire évènementiel !",
                "la solution idéale !",
                "l'expertise audiovisuel !",
              ],
              autoStart: true,
              loop: true,
              delay: 80
            }}
        
        />
        </div>

      <div className="container aboutContainer">
        <div className="row">
          <div className="col-xl-6 col-lg-6">
            <h1 className="aboutTitle" data-testid="textTitle">A propos</h1>
            <div className="aboutText">
              <p>Un projet est avant tout une idée qui germe dans un coin et qui mûrit lentement, grandissant et s'étirant au fil du temps. "Falcohm system", voici la nôtre. </p>

              <p>Initialement conçu pour servir de Sound Système perso, le chemin parcouru est déjà tel que nous répondons maintenant sous le nom d'une ASBL. Constituée essentiellement de passionnés autodidactes, nous continuons de faire avancer le projet par différentes voies.</p>

              <p>L'association a un an déjà et contribue à l'offre de service de location de matériels son/lumière dans la région wallonne. </p>
              <p> Parallèlement, nous proposons nos propres soirées organisées en interne, et plus récemment des streamings, dans lesquelles nous utilisons nos équipements et développons nos connaissances.</p>

              <p>Nous défendons, avec ce projet, les valeurs de la musique en tant qu'art essentiel et encré dans la société à tout point de vue. La vision de notre ASBL reflète la liberté dont doit bénéficier cette culture.</p>
              <p>Nous sommes heureux de pouvoir vous la partager par le biais de ce site qui on l'espère répondra à vos attentes.</p>
            </div>
            <div className="buttonAboutDiv">
              <Button
                variant="contained"
                component={Link}
                disabled={loading}
                to={"/request_quote"}
                className="buttonAbout"
                sx = {{display : "none"}}
                >
                En savoir plus
              </Button>
            </div>

          </div>
          <div className="col-xl-6 col-lg-6 rightpictureDiv">
          {isBigScreen ? 
              <img className="rightPicture" src="https://res.cloudinary.com/dutkkgjm5/image/upload/v1659800229/296873810_745709496541099_8575950716506421386_n_tsjiav.jpg"></img>
              :
              <img className="rightPicture" src="https://res.cloudinary.com/dutkkgjm5/image/upload/v1662050549/bflkavcurv3ca9akfamq.jpg"></img>
          }
          
          </div>
        </div>

      </div>
      <div className="productList">
        
        <Typography
          gutterBottom
          variant="h3"
          sx={{ textAlign: "center", fontWeight: "bold", color : "#1D217C"}}
          component="div"
          className="titleProduct"
        >
          Découvrez notre matériel
        </Typography>
        <div className="searchContainer">
          <TextField
            id="outlined-basic"
            value={searchQ}
            sx={{width:{md:"50%",lg:"35%",xs:"80%"}}}
            onChange={(e) => setSearchQ(e.target.value)}
            label="Chercher du matériel"
            variant="outlined"
          />
        </div>
        <ProductSection searchQ={searchQ} isPage={isPage} />
        <div className="buttonMoreDiv">
        {show && 
          <Button
          variant="contained"
          className="buttonMore"
          component={Link}
          disabled={loading}
          to={"/the_products"}
          >
            Voir plus
          </Button>
        }
        </div>
      </div>
      {/* Lien vers create quote */}
      <div className="quoteLink container">
          <h1 className='col-xl-12 helpTitle'>
              Besoin d'un devis pour un évènement ?
          </h1>
          <p className="secondTitle">Tout type d'évènements</p>
          <Button
            data-testid="buttonAsk"
            variant="contained"
            component={Link}
            disabled={loading}
            to={"/request_quote"}
            className="buttonQuote"
            >
              Faire une demande
            </Button>
      </div>
      {/* form contact */}
      <div className="contactForm">
      <Box
      component="form"
      sx={{
        m: 1,
        width: { md: "50%", xs: "60%" },
        margin: "auto",
      }}
      noValidate
      autoComplete="off"
    >
      <Typography
        gutterBottom
        variant="h4"
        className="titleForm"
        component="div"
      >
        Contactez-nous !
      </Typography>

      <small style={{ margin: "10px", color: "crimson" }}> {error}</small>
      <Box sx={{ textAlign: "center" }}>
        <TextField
          required
          type="name"
          value={name}
          sx={{ width: "80%", margin: " 10px auto", padding: "4px" }}
          onChange={(e) => setName(e.target.value)}
          label="Nom "
        />
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <TextField
          required
          type="email"
          value={email}
          sx={{ width: "80%", margin: " 10px auto", padding: "4px" }}
          onChange={(e) => setEmail(e.target.value)}
          label="Email "
        />
      </Box>

      <Box sx={{ textAlign: "center" }}>
        <TextField
          type="number"
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          value={phone}
          sx={{ width: "80%", margin: " 10px auto", padding: "4px" }}
          onChange={(e) => setPhone(e.target.value)}
          label="Numéro de téléphone"
        />
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <TextField
          value={detail}
          multiline
          rows={5}
          sx={{ width: "80%", margin: " 10px auto", padding: "4px" }}
          onChange={(e) => setDetail(e.target.value)}
          label="Informations "
        />
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          onClick={handleSendMessage}
          className="buttonTakeInfo"
          endIcon={<SendIcon />}
        >
          {loading ? "Loading" : "Envoyer"}
        </Button>
      </Box>
    </Box>
      </div>
      <div className="container footerContainer">
        <div className="row">
          <div className="col logoDiv">
            <Box 
              component="img"
              src= "https://res.cloudinary.com/dutkkgjm5/image/upload/v1660062946/Falc_ohm_n_et_b_txt_circulaire_i5oy9p.png"
              className="logoFooter"
              alt="logoFooter"
              
              >
                
            </Box>
            
            </div>
            <div className="col ">
              <div className="row linkFooter">
                {/* <div className="col " data-testid="footerText" >
                  
                FAQ
              </div> */}
              <div className="col linkDiv">
              <Link to="/legal_mentions" className="legalMention" >Mentions légales</Link>
              </div>
              </div>
            </div>
            <div className="col socialsDiv">
              <div className="row">
                  <div className="col">
                      <a href="https://www.instagram.com/falcohm6tm/" target="_blank" rel="noreferrer">
                        <img
                          src="https://res.cloudinary.com/dutkkgjm5/image/upload/v1660064625/Instagram_zhzxba.png"
                          alt="instaLink"
                          className="logoInsta"
                        />
                      </a>
                  </div>
                  {/* <div className="col">
                    <a href="https://www.instagram.com/falcohm6tm/" target="_blank" rel="noreferrer">
                        <img
                          src= "https://res.cloudinary.com/dutkkgjm5/image/upload/v1660064625/Vector_ioag3a.png"
                          alt="YTlink"
                          className="logoYT"
                        />
                      </a>
                  </div> */}
                  <div className="col">
                    <a href="https://www.facebook.com/Falcohm6TM" target="_blank" rel="noreferrer">
                        <img
                           src= "https://res.cloudinary.com/dutkkgjm5/image/upload/v1660064625/Vector_1_tcpv1s.png"
                           className="logoFb"
                          alt="logoFb"
                      
                        />
                      </a>
                  </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
