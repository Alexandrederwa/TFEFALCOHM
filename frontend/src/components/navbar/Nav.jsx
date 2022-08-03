import axios from "axios";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../store";
import "./nav.css";
const Nav = () => {
  const { setUser, user } = useUser();
  const navigate = useNavigate();
  const logout = async () => {
    await axios.post("auth/logout");
    window.location.reload();
  };
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await axios.get("/auth/getUser");
        setUser(data);

      } catch (error) {}
    };
    if (!user) {
      checkUser();
    }

    // eslint-disable-next-line
  }, [navigate]);
  return (
    <div className="navbar">
      <h1>MarketPlace</h1>
      <ul className="navlist">
     
          <li>
            <Link  className="navLink" to={"/"}>Home</Link>
          </li>
      
        {user?.role ==="user" ? (
          <li>
            <Link  className="navLink" to={"/my_quotes"}>Quotes-History</Link>
          </li>
        ):null}
        {user && (
          <li>
            <Link  className="navLink" to={"/profile"}>Profile</Link>
          </li>
        )}
        {user?.role==="admin" ? (
          <li>
            <Link  className="navLink" to={"/dashboard"}>Dashboard</Link>
          </li>
        ):null}
        {user?.role!=="admin"?<li>
          <Link  className="navLink" to={"/request_quote"}>Request-Quote</Link>
        </li>:null}
        {!user && (
          <li>
            <Link  className="navLink" to={"/login"}>Login</Link>
          </li>
        )}
        {!user && (
          <li>
            <Link  className="navLink" to={"/register"}>Register</Link>
          </li>
        )}
        {user && <li onClick={logout}>Logout</li>}
      </ul>
    </div>
  );
};

export default Nav;
