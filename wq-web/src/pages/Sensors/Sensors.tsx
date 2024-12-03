import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  TablePagination,
  Chip,
} from "@mui/material";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import { useState } from "react";

const BaseTable = (): JSX.Element => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const rows = [
    { name: "Sensor A", calories: 100, fat: 10, status: "Active" },
    { name: "Sensor B", calories: 200, fat: 20, status: "Inactive" },
    { name: "Sensor C", calories: 300, fat: 30, status: "Active" },
    { name: "Sensor D", calories: 400, fat: 40, status: "Inactive" },
    { name: "Sensor E", calories: 500, fat: 50, status: "Active" },
  ];

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - rows.length);

  return (
    <TableContainer
      component={Paper}
      sx={{ padding: "50px", borderRadius: "20px" }}
    >
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
              Sensor
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
              align="center"
            >
              Type
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
              align="center"
            >
              Current Reading
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
              align="center"
            >
              Unit
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
              align="center"
            >
              Status
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row" sx={{ fontSize: "0.8rem" }}>
                {row.name}
              </TableCell>
              <TableCell sx={{ fontSize: "0.8rem", width: 160 }} align="center">
                {row.calories}
              </TableCell>
              <TableCell sx={{ fontSize: "0.8rem", width: 160 }} align="center">
                {row.fat}
              </TableCell>
              <TableCell sx={{ fontSize: "0.8rem", width: 160 }} align="center">
                {row.fat}
              </TableCell>
              <TableCell sx={{ fontSize: "0.8rem", width: 160 }} align="center">
                <Chip
                  label={row.status}
                  sx={{
                    fontSize: "0.6rem",
                    height: "20px",
                    width: "80px",
                    backgroundColor:
                      row.status === "Active" ? "#a8f1d4" : "#fdd5d5",
                    color: row.status === "Active" ? "#008000" : "#ff0000",
                    border: `1px solid ${
                      row.status === "Active" ? "#008000" : "#ff0000"
                    }`,
                    borderRadius: "5px",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={5} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              sx={{
                ".MuiTablePagination-toolbar": { fontSize: "0.7rem" },
                ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                  {
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "grey",
                  },
                ".MuiTablePagination-select": {
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "grey",
                },
              }}
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={5}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default BaseTable;
