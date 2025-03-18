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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Box,
} from "@mui/material";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { apiRequest } from "../Dashboard/services/api";
import DASHBOARD_API_ENDPOINTS from "../Dashboard/services/config";
import { AuthContext } from "../../components/auth/AuthProvider";

const CompareSensors = (): JSX.Element => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dropdownValue, setDropdownValue] = React.useState("meewatura");
  const [sensorData, setSensorData] = useState<any[]>([]);
  const authContext = useContext(AuthContext);
  const token: string | undefined = authContext?.token;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiRequest<Record<number, number>>(
          "GET",
          DASHBOARD_API_ENDPOINTS.FETCH_MODBUS_DATA,
          token
        );

        if (data) {
          const formattedData = [
            {
              name: "Turbidity",
              value: data[5001] || 0,
              unit: "NTU",
              status: "Active",
            },
            {
              name: "pH",
              value: data[5002] || 0,
              unit: "pH",
              status: "Active",
            },
            {
              name: "Conductivity",
              value: data[5003] || 0,
              unit: "µS/cm",
              status: "Active",
            },
            {
              name: "Chlorine Usage",
              value: data[5004] || 0,
              unit: "mg/L",
              status: "Active",
            },
            {
              name: "PAC Usage",
              value: data[505] || 0,
              unit: "mg/L",
              status: "Active",
            },
            {
              name: "Lime Usage",
              value: data[5006] || 0,
              unit: "kg/m³",
              status: "Active",
            },
          ];
          setSensorData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching Modbus data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, [token]);

  const handleChange = (event: SelectChangeEvent) => {
    setDropdownValue(event.target.value as string);
  };

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
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <TableContainer
          component={Paper}
          sx={{ width: "48%", padding: "30px", borderRadius: "20px" }}
        >
          {" "}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <FormControl>
              <InputLabel
                id="demo-simple-select-label"
                sx={{ fontSize: "0.8rem" }}
              >
                Location
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={dropdownValue}
                label="Age"
                onChange={handleChange}
                sx={{ height: 50, width: 200 }}
              >
                <MenuItem value={"meewatura"}>
                  Meewatura Water Treatment Plant
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Table sx={{ width: "100%" }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                  Sensor
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
                ? sensorData.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : sensorData
              ).map((row, index) => (
                <TableRow key={index}>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ fontSize: "0.8rem" }}
                  >
                    {row.name}
                  </TableCell>

                  <TableCell
                    sx={{ fontSize: "0.8rem", width: 160 }}
                    align="center"
                  >
                    {row.value}
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.8rem", width: 160 }}
                    align="center"
                  >
                    {row.unit}
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.8rem", width: 160 }}
                    align="center"
                  >
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
        <TableContainer
          component={Paper}
          sx={{ width: "48%", padding: "30px", borderRadius: "20px" }}
        >
          {" "}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <FormControl>
              <InputLabel
                id="demo-simple-select-label"
                sx={{ fontSize: "0.8rem" }}
              >
                Location
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={dropdownValue}
                label="Age"
                onChange={handleChange}
                sx={{ height: 50, width: 200 }}
              >
                <MenuItem value={"meewatura"}>
                  Meewatura Water Treatment Plant
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Table sx={{ width: "100%" }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: "0.8rem" }}>
                  Sensor
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "0.8rem" }}
                  align="center"
                >
                  Current Reading
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "0.8rem" }}
                  align="center"
                >
                  Unit
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "0.8rem" }}
                  align="center"
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? sensorData.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : sensorData
              ).map((row, index) => (
                <TableRow key={index}>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ fontSize: "0.8rem" }}
                  >
                    {row.name}
                  </TableCell>

                  <TableCell
                    sx={{ fontSize: "0.8rem", width: 160 }}
                    align="center"
                  >
                    {row.value}
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.8rem", width: 160 }}
                    align="center"
                  >
                    {row.unit}
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.8rem", width: 160 }}
                    align="center"
                  >
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
      </Box>
    </>
  );
};

export default CompareSensors;
