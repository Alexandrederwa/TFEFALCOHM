import axios from "axios";
import React, { useEffect, useId, useState } from "react";
import { css } from "@emotion/react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableHead,
  TableRow,
} from "@mui/material";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import QuoteRow from "./QuoteRow";
import { ClipLoader } from "react-spinners";
dayjs.extend(relativeTime);
const override = css`
  display: block;
  margin: 10% auto;
  border-color: crimson;
`;
const QuotesList = () => {
  const id = useId()
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(100000);
  const handlePagination = (event, page) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
    setCurrentPage(0);
  };
  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/quotes/all");
      if (data) {
        setQuotes(data);
      }
      setLoading(false);
    } catch (error) {
      alert(error?.response.data.message);
      setLoading(false);
    }
  };
  const handleDeleteQuote = async (id) => {
    try {
      console.log("Deleting Quote");
      const { data } = await axios.delete(`/api/quotes/${id}`);
      fetchQuotes();
      window.location.reload();
    } catch (error) {
      alert(error?.response.data.message);
    }
  };

  useEffect(() => {
    fetchQuotes();
    // eslint-disable-next-line
  }, []);
  if (loading && !quotes?.length)
  return (
    <ClipLoader color={"red"} loading={loading} css={override} size={60} />
  );
  return (
    <div>
      {quotes.length ? (
        // <Container >
        <div style={{ margin: "20px 30px" }}>
          <TableContainer>
            <Table>
              <TableHead sty>
                <TableRow
                  style={{
                    backgroundColor: "#339af0",
                    color: "#ffffff",
                  }}
                >
                  <TableCell style={{ textAlign: "center" }}>
                    Email du client
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    Utilisateur inscrit
                  </TableCell>

                  <TableCell style={{ textAlign: "center" }}>
                    Décision du client
                  </TableCell>

                  <TableCell style={{ textAlign: "center" }}>Statut</TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    Prix total
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    Nombre d'article 
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    Date de création
                  </TableCell>

                  <TableCell style={{ textAlign: "center" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quotes?.slice(0, limit).map((quote) => {
                  return (
                    <QuoteRow key={quote.id+id} fetchQuotes={fetchQuotes}loading={loading}  quote={quote} handleDeleteQuote={handleDeleteQuote} />
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {/* <TablePagination
            component="div"
            count={quotes.length}
            onPageChange={handlePagination}
            onRowsPerPageChange={handleLimitChange}
            page={currentPage}
            rowsPerPage={limit}
            rowsPerPageOptions={[10, 25 ,1000]}
          /> */}
        </div>
      ) : // </Container>
      loading ? (
        <h1>Loading</h1>
      ) : (
        <h1>No Quotes Available</h1>
      )}
    </div>
  );
};

export default QuotesList;
