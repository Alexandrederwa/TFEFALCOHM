import React from "react";

import ItemListSection from "../../components/itemsList/ItemsListSection";
import "./itemsListPage.css"
const ItemsList = () => {

  return (
    <div className="itemsListPage">
      {" "}
      <h1>Items</h1>{" "}
      <ItemListSection/>
    </div>
  );
};

export default ItemsList;
