import { css } from "@emotion/react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect, useState, useTransition } from "react";
import { ClipLoader } from "react-spinners";
import AddProduct from "./AddProduct";
import "./productList.css";
import ProductRow from "./ProductRow";

dayjs.extend(relativeTime);

const override = css`
  display: block;
  margin: 10% auto;
  border-color: crimson;
`;
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [edit, setEdit] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [limit, setLimit] = useState(10);
  const handlePagination = (_, page) => {
    setCurrentPage(page);
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    startTransition(() => {
      setEdit(true);
    });
  };
  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("products/all");
      if (data) {
        setProducts(data);
      }
      setLoading(false);
    } catch (error) {
      alert(error?.response.data.message);
      setLoading(false);
    }
  };
  const handleDeleteProduct = async (id) => {
    try {
      console.log("Deleting Quote");
      const { data } = await axios.delete(`/products/${id}`);
      if (data?.success) {
        fetchProducts();
      }
    } catch (error) {
      alert(error?.response.data.message);
    }
  };
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);
  if (loading && !products?.length)
    return (
      <ClipLoader color={"red"} loading={loading} css={override} size={60} />
    );
  return (
    <div>
      {products?.length ? (
        <Container>
          <AddProduct
            edit={edit}
            editProduct={editProduct}
            setEditProduct={setEditProduct}
            setEdit={setEdit}
            fetchProducts={fetchProducts}
            isPending={isPending}
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  style={{
                    backgroundColor: "AppWorkspace",
                    color: "#ffffff",
                    textAlign: "center",
                  }}
                >
                  <TableCell style={{ textAlign: "center" }}>Name</TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    Category
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>Price</TableCell>
                  <TableCell style={{ textAlign: "center" }}>Stock</TableCell>

                  <TableCell style={{ textAlign: "center" }}>
                    Created At
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    Updated At
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products?.slice(0, limit).map((product) => (
                  <ProductRow
                    key={product.id + product.price}
                    handleEditProduct={handleEditProduct}
                    loading={loading}
                    product={product}
                    handleDeleteProduct={handleDeleteProduct}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={products.length}
            onPageChange={handlePagination}
            onRowsPerPageChange={handleLimitChange}
            page={currentPage}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Container>
      ) : loading ? (
        <h1>Loading</h1>
      ) : (
        <h1>No Users Available</h1>
      )}
    </div>
  );
};

export default ProductList;
