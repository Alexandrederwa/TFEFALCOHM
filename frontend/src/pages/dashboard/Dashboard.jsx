import { Button } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./dashboard.css";
const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Panneau d'administration de Falc'ohm System</h1>
      {/* <div className="dashboardNav">
      <Link to={"users"}>   <button className='buttons'>Users</button></Link>
      <Link to={"products"}>  <button className='buttons'>Products</button></Link>
   <Link to={"quotes"}>  <button className='buttons'>Quotes </button>  </Link>
      </div> */}
      <Box
        sx={{
          marginTop: "30px ",
          padding: { xs: "30px", sm: "0px" },
          display: "flex",
          justifyContent: "center",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Button
          variant="contained"
          sx={{ margin: "5px 20px", fontSize: "22px" }}
          color="warning"
          component={Link}
          to="users"
        >
          Utilisateurs
        </Button>
        <Button
          sx={{ margin: "5px 20px", fontSize: "22px" }}
          variant="contained"
          color="warning"
          component={Link}
          to={"products"}
        >
          Produits
        </Button>
        <Button
          variant="contained"
          color="warning"
          sx={{ margin: "5px 20px", fontSize: "22px" }}
          component={Link}
          to={"quotes"}
        >
          Devis
        </Button>
      </Box>
      <br />
      <Outlet />
    </div>
  );
};

export default Dashboard;
