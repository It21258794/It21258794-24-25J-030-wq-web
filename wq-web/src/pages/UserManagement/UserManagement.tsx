import { useState, useEffect, useContext } from "react";
import {
  TextField,
  InputAdornment,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  Box,
  Chip,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { getUsers } from "./services/api";
import { AuthContext } from "../../components/auth/AuthProvider";
import AddIcon from "@mui/icons-material/Add";
import CreateUserDialog from "../Common/DialogBoxes/CreateUserDialog";
import { Tooltip } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveUserConfirmation from "../Common/DialogBoxes/RemoveUserConfirmationDialog";

const UserManagement = (): JSX.Element => {
  const authContext = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [rows, setRows] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(
    dayjs().subtract(30, "day").startOf("day")
  );
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(
    dayjs().endOf("day")
  );
  const [status, setStatus] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openRemoveUserDialog, setOpenRemoveUserDialog] = useState(false);
  const [userRow, setUserRow] = useState<any>();
  const token: any = authContext?.token;

  useEffect(() => {
    fetchUsers(page, searchQuery, startDate, endDate, status);
  }, [page, searchQuery, startDate, endDate, status]);

  const fetchUsers = async (
    page: number,
    query: string,
    startDate: dayjs.Dayjs | null,
    endDate: dayjs.Dayjs | null,
    status:string
  ) => {
    authContext?.setIsLoading(true)
    setError(null);
    try {

      const formattedStartDate = startDate
      ? encodeURIComponent(startDate.startOf("day").toISOString())
      : "";
    const formattedEndDate = endDate
      ? encodeURIComponent(endDate.endOf("day").toISOString())
      : "";
      const result = await getUsers(page, 10, query, formattedStartDate, formattedEndDate, status, token);
      if (result && Array.isArray(result.content)) {
        setRows(result.content);
        setTotalPages(result.totalPages);
      } else {
        setRows([]);
        setError("No valid data found");
      }
      setTimeout(() => {
        authContext?.setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError("Failed to fetch users");
      console.log(error)
    } finally {
      // setLoading(false);
    }
  };

  const formatRole = (role: string) => {
    switch (role) {
      case "USER":
        return "User";
      case "SUPER_ADMIN":
        return "Super Admin";
      case "ADMIN":
        return "Admin";
      default:
        return role;
    }
  };
  
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = (newUser?: any) => {
    setOpenDialog(false);
    if (newUser && Object.keys(newUser).length > 0) {
      setRows((prevRows) => [newUser, ...prevRows]);
    }
  };

  const handleOpenRemoveUser = (row: any) =>{
    setUserRow(row);
    setOpenRemoveUserDialog(true);
  }

  const handleCloseRemoveDialog = (updatedUser?:any) =>{
    setOpenRemoveUserDialog(false)
    if(updatedUser){
      setRows((prevRows) =>
        prevRows.map((r) =>
          r.id === updatedUser.id ? { ...r, status: "REMOVED" } : r
        )
      );
    }
    
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ margin: "20px" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", marginBottom:"25px" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <TextField
              placeholder="Search"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: "250px",
                backgroundColor: "white",
                borderRadius: "20px",
              }}
              InputProps={{
                sx: {
                  borderRadius: 3,
                  height: 30,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "13px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#757575",
                  },
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <span style={{ fontSize: "16px" }}>
                      <SearchIcon fontSize="small" color="action" />
                  </span>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                sx: {
                  fontSize: "12px",
                  top: "-7px",
                },
              }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <DatePicker label="Start Date" value={startDate} onChange={(date) => setStartDate(date)} sx={{ width: "120px", backgroundColor: "white" }} slotProps={{
    textField: {
      size: "small",
      InputProps: { sx: { fontSize: "12px" } },
      inputProps: { sx: { fontSize: "12px", padding: "5px 10px" } },
    },
  }} />
              <DatePicker label="End Date" value={endDate} onChange={(date) => setEndDate(date)} sx={{ width: "120px", backgroundColor: "white" }} slotProps={{
    textField: {
      size: "small",
      InputProps: { sx: { fontSize: "12px" } },
      inputProps: { sx: { fontSize: "12px", padding: "5px 10px" } },
    },
  }} />
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                displayEmpty
                size="small"
                sx={{ width: "110px", backgroundColor: "white",  height: 30,
                  fontSize: "12px",
                  borderRadius: 3,
                  "& .MuiSelect-select": {
                    padding: "10px",
                  }}}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="PENDING_VERIFICATION">Pending</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
              </Select>
            </Box>
          </Box>
            <Button
              variant="contained"
              // color="primary"
              onClick={handleOpenDialog}
              sx={{ ml: "auto", display: "flex", alignItems: "left" , backgroundColor:"#102D4D"}}
            >
              <AddIcon sx={{ marginRight: "5px" ,fontSize: "12px"}} />
                <span style={{ fontSize: "12px" }}>
                  User
                </span>
            </Button>
        </Box>
        <Table sx={{ marginBottom: "10px", tableLayout: "fixed", width: "100%" }}>
  <TableHead>
    <TableRow>
      {[
        { label: "First Name", width: "12%" },
        { label: "Last Name", width: "12%" },
        { label: "Email", width: "25%" },
        { label: "Phone", width: "12%" },
        { label: "Role", width: "12%" },
        { label: "Joined on", width: "12%" },
        { label: "Status", width: "15%" },
      ].map(({ label, width }) => (
        <TableCell key={label} sx={{ fontWeight: "bold", width, textAlign: "center" }}>
          {label}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
  <TableBody>
    {rows.map((row: any, index) => (
      <TableRow key={index} sx={{ "&:last-child": { marginBottom: 0 } }}>
        <TableCell colSpan={7} sx={{ padding: "0", border: "none" }}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              padding: "8px",
              marginBottom: "10px",
              overflow: "hidden",
            }}
          >
            {[
              { value: row.firstName, width: "12%" },
              { value: row.lastName, width: "12%" },
              { value: row.email, width: "25%" },
              { value: row.phone, width: "12%" },
              { value: formatRole(row.role), width: "12%" },
              { value: row.createdAt ? dayjs(row.createdAt).format("YYYY-MM-DD") : "N/A", width: "12%" },
            ].map(({ value, width }, idx) => (
              <Box
                key={idx}
                sx={{
                  width,
                  textAlign: "center",
                  padding: "8px",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                }}
              >
                {value}
              </Box>
            ))}
            <Box
              sx={{
                width: "15%",
                textAlign: "center",
                padding: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Chip
                sx={{
                  fontSize: "0.6rem",
                  height: "20px",
                  width: "80px",
                  backgroundColor:
                    row.status === "ACTIVE" ? "#a8f1d4" : row.status === "PENDING_VERIFICATION" ? "#ffe5b4" : "#fdd5d5",
                  color: row.status === "ACTIVE" ? "#008000" : row.status === "PENDING_VERIFICATION" ? "#d2691e" : "#ff0000",
                  border: `1px solid ${
                    row.status === "ACTIVE" ? "#008000" : row.status === "PENDING_VERIFICATION" ? "#d2691e" : "#ff0000"
                  }`,
                  borderRadius: "5px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
                label={row.status === "PENDING_VERIFICATION" ? "Pending" : row.status}
              />
              <Tooltip title="Edit Status">
                <DeleteIcon
                  sx={{
                    fontSize: "18px",
                    color: "red",
                    cursor: "pointer",
                    "&:hover": { color: "darkred" },
                  }}
                  onClick={() => handleOpenRemoveUser(row)}
                />
              </Tooltip>
            </Box>
          </Box>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
<Pagination
  count={totalPages}
  page={page + 1}
  onChange={(_, newPage) => setPage(newPage - 1)}
  sx={{
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
  }}
/>
        <CreateUserDialog open={openDialog} onClose={handleCloseDialog} />
        <RemoveUserConfirmation  open={openRemoveUserDialog} onClose={handleCloseRemoveDialog} row={userRow}/>
      </Box>
    </LocalizationProvider>
  );
};

export default UserManagement;
