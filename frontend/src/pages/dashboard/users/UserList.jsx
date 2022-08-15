import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";

import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const UserList = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/auth/all");

      if (data?.users) {
        setUsers(data?.users);
      }
      setLoading(false);
    } catch (error) {
      alert(error?.response.data.message);
      setLoading(false);
    }
  };
  const handlePagination = (_, page) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };
  const handleDeleteUser = async (id) => {
    try {
      console.log("Changing roles");
      const { data } = await axios.delete(`/api/auth/${id}`);
      if (data?.success) {
        fetchUsers();
      }
    } catch (error) {
      alert(error?.response.data.message);
    }
  };
  const handleChangeRole = async (id, userRole) => {
    const role = userRole === "user" ? "admin" : "user";
    try {
      console.log("Changing roles");
      const { data } = await axios.put(`/api/auth/change_role/${id}`, { role });
      if (data?.user) {
        fetchUsers();
      }
    } catch (error) {
      alert(error?.response.data.message);
    }
  };
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);
  const override = css`
    display: block;
    margin: 10% auto;
    border-color: crimson;
  `;
  if (loading && !users?.length)
    return (
      <ClipLoader
        color={"crimson"}
        loading={loading}
        css={override}
        size={60}
      />
    );
  return (
    <div>
      {users.length ? (
        <Container>
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
                  <TableCell style={{ textAlign: "center" }}>Email</TableCell>
                  <TableCell style={{ textAlign: "center" }}>Role</TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    Joined On
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.slice(0, limit).map((user) => (
                  <TableRow data-testid="details" key={user.id}>
                    <TableCell style={{ textAlign: "center" }}>
                      {user?.name}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {user?.email}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {user?.role.toUpperCase()}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {dayjs().from(user.createdAt, true)} ago
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={loading}
                        sx={{ padding: "6px", marginLeft: "4px" }}
                      >
                        Delete{" "}
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="info"
                        onClick={() => handleChangeRole(user.id, user.role)}
                        disabled={loading}
                        sx={{ padding: "6px", marginLeft: "4px" }}
                      >
                        Change {user.role === "user" ? "ADMIN" : "USER"} Role
                      </Button>{" "}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={users.length}
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

export default UserList;
