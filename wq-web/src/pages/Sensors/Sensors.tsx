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
  Button,
  Box,
} from "@mui/material";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/auth/AuthProvider";
import { apiRequest } from "../Dashboard/services/api";
import DASHBOARD_API_ENDPOINTS from "../Dashboard/services/config";

const Sensors = (): JSX.Element => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [age, setAge] = useState("");
  const [sensorData, setSensorData] = useState<any[]>([]);
  const authContext = useContext(AuthContext);
  const token: string | undefined = authContext?.token;

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
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

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - sensorData.length);

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{padding: '50px', borderRadius: '20px'}}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '20px'
          }}
        >
          <FormControl>
            <InputLabel id="demo-simple-select-label" sx={{fontSize: '0.8rem'}}>
              Location
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label="Age"
              onChange={handleChange}
              sx={{height: 50, width: 200}}
            >
              <MenuItem value={10}>Western - Production</MenuItem>
              <MenuItem value={20}>Western - Central</MenuItem>
              <MenuItem value={30}>Sabaragamuwa</MenuItem>
            </Select>
          </FormControl>

          <Button
            sx={{height: 30, fontSize: '0.7rem'}}
            variant="contained"
            onClick={() => navigate("/user/sensorsDashboard/compare")}
          >
            Compare
          </Button>
        </Box>

        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 'bold', fontSize: '0.9rem'}}>
                Sensor
              </TableCell>
              <TableCell
                sx={{fontWeight: 'bold', fontSize: '0.9rem'}}
                align="center"
              >
                Current Reading
              </TableCell>
              <TableCell
                sx={{fontWeight: 'bold', fontSize: '0.9rem'}}
                align="center"
              >
                Unit
              </TableCell>
              <TableCell
                sx={{fontWeight: 'bold', fontSize: '0.9rem'}}
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
                <TableCell sx={{fontSize: '0.8rem', width: 160}} align="center">
                  <Chip
                    label={row.status}
                    sx={{
                      fontSize: '0.6rem',
                      height: '20px',
                      width: '80px',
                      backgroundColor:
                        row.status === 'Active' ? '#a8f1d4' : '#fdd5d5',
                      color: row.status === 'Active' ? '#008000' : '#ff0000',
                      border: `1px solid ${
                        row.status === 'Active' ? '#008000' : '#ff0000'
                      }`,
                      borderRadius: '5px',
                      textAlign: 'center',
                      fontWeight: 'bold'
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{height: 53 * emptyRows}}>
                <TableCell colSpan={5} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                sx={{
                  '.MuiTablePagination-toolbar': {fontSize: '0.7rem'},
                  '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows':
                    {
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: 'grey'
                    },
                  '.MuiTablePagination-select': {
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: 'grey'
                  }
                }}
                rowsPerPageOptions={[6, 12, 18, { label: "All", value: -1 }]}
                colSpan={5}
                count={sensorData.length}
                rowsPerPage={6}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
};

export default Sensors;
