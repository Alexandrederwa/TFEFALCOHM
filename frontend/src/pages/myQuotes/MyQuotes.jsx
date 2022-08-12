import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuotes } from "../../store";
import Select from "react-select";

import "./myQuotes.css";
import QuoteBox from "./QuoteBox";
const MyQuotes = () => {
	// Status to filter the quotes
  const Status = [
    { value: "all", label: "All" },
    { value: "sent", label: "sent" },
    { value: "accepted", label: "accepted" },
    { value: "discounted", label: "discounted" },
  ];
  const [status, setStatus] = useState("");
  const [allQuotes, setAllQuotes] = useState();

  const { quotes, setQuotes } = useQuotes();
  const [loading, setLoading] = useState(false);
  
  //Handle change status
  const handleSetStatus = (e) => {
    setLoading(true)
    setStatus(e.value);
    console.log(e.value);
    setAllQuotes(
      quotes.filter((val) => {
        let returnValue = false;
        if (
          val.status.toLowerCase().includes(e.value) ||
          e.value === "all" ||
          e.value === ""
        ) {
          returnValue = true;
        }
        return returnValue;
      })
    );
    setLoading(false)

  };
  useEffect(() => {
    setStatus("")
    const getMyQuotes = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/quotes/my_quotes");
        if (data) {
          setAllQuotes(data);
          setQuotes(data);
        }
      } catch (error) {
        console.log(error.message);
        alert("Failed to fetch the quotes");
      }
      setLoading(false);
    };

    getMyQuotes();
    // eslint-disable-next-line
  }, []);
  if (loading && !quotes.length)
    return (
      <h1 style={{ margin: "30px auto", textAlign: "center" }}>LOADING</h1>
    );

  return (
    <div className="myQuotesPage">
      <h1 style={{ textAlign: "center", marginTop: "30px" }}>My Quotes</h1>
      <div className="filterBox">
        <label htmlFor="Filter">
          {" "}
          <h4 style={{ marginBottom: "10px" }}>Status Filter</h4>
        </label>

        <Select
          defaultValue={status}
          onChange={handleSetStatus}
          options={Status}
          id="Filter"
        ></Select>
      </div>
      {allQuotes?.length
        ? allQuotes.map((quote) => <QuoteBox key={quote.id} quote={quote} />)
        : !loading ? <h1 style={{textAlign:"center"}}>No Quotes Available </h1>:null}
    </div>
  );
};

export default MyQuotes;
