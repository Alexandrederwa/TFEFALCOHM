import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { HashRouter } from "react-router-dom";
// import Nav from "./components/navbar/Nav";
import NavBar from "./components/navBar/NavBar"
import Dashboard from "./pages/dashboard/Dashboard";
import UserList from "./pages/dashboard/users/UserList";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import MyQuotes from "./pages/myQuotes/MyQuotes";
import { css } from "@emotion/react";
import MyProfile from "./pages/profile/MyProfile";
import QuotePage from "./pages/quote/QuotePage";
import Register from "./pages/register/Register";
import Invoice from "./pages/invoice/Invoice";
import { useUser } from "./store";
import { ClockLoader , HashLoader} from "react-spinners";
import QuotesList from "./pages/dashboard/quotes/QuotesList";
import ProductList from "./pages/dashboard/products/ProductList";
import RequestQuote from "./pages/requestQuote/RequestQuote";
import ItemListSection from "./components/itemsList/ItemsListSection";
import LegalMention from "./pages/legalMention/LegalMention";
import ProductsPage from "./pages/productsPage/ProductsPage";
const override = css`
  display: block;
  margin: 20% auto;
  border-color: red;
`;
function App() {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await axios.get("/api/auth/getUser");

        setUser(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
   
    checkUser();
   

    // eslint-disable-next-line
  }, []);
  if (loading)
    return (
      <HashLoader color={"red"} loading={loading} css={override} size={100} />
    );
  return ( 
    <HashRouter>
   
      <NavBar/>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route
          exact
          path="/login"
          element={user ? <Navigate to="/" /> : <Login />}
        />
        <Route
          exact
          path="/register"
          // element={user ? <Navigate to="/" /> : <Register />}
          element={<Register />}
        />
        <Route
          exact
          path="my_quotes"
          element={
            <UserProtectedRoute Element={MyQuotes} user={user} Reverse={"/"} />
          }
        />
        <Route
          exact
          path="/profile"
          element={
            <UserProtectedRoute
              Element={MyProfile}
              user={user}
              Reverse={"/"}
            />
          }
        />

        <Route exact path="/quote" element={<QuotePage />} />
        <Route exact path="/request_quote" element={<RequestQuote />} />
        <Route path="/legal_mentions" element={<LegalMention/>} />		
        <Route path="/the_products" element={<ProductsPage/>} />	
        {/* ADMIN DASHBOARD ROUTES */}
        <Route
          exact
          path="/items_list"
          element={
            <AdminProtectedRoute
              Element={ItemListSection}
              user={user}
              Reverse={"/"}
            />
          }
        />
        <Route
          exact
          path="/dashboard"
          element={
            <AdminProtectedRoute
              Element={Dashboard}
              user={user}
              Reverse={"/"}
            />
          }
        >
          <Route path="users" element={<UserList />} />
          <Route path="quotes" element={<QuotesList />} />
          <Route path="products" element={<ProductList />} />
        </Route>
        <Route exact
          path="/quote/:id"
          element={
            <UserProtectedRoute
              Element={Invoice}
              user={user}
              Reverse={"/"}
            />
          }>
          {/* <Invoice /> */}
        </Route>
      </Routes>
    </HashRouter>
  );
}

const UserProtectedRoute = ({ Element, Reverse, user }) => {
  if (user) {
    return <Element />;
  }
  return <Navigate to={Reverse} />;
};
const AdminProtectedRoute = ({ Element, Reverse, user }) => {
  if (user?.role === "admin") {
    return <Element />;
  }
  return <Navigate to={Reverse} />;
};
export default App;
