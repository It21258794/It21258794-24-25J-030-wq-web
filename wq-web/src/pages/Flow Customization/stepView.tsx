import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Grid, TextField, Button, Typography, Paper, Snackbar, Alert } from "@mui/material";
import { Table, TableHead, TableRow, TableCell, TableBody, TableFooter, TablePagination } from "@mui/material";
import { getStepValuesByStepId, getSteps, updateStepValue, getAllStepValues } from "./server/flow-customisationAPI";
import { AuthContext } from "../../components/auth/AuthProvider";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";

interface StepValue {
  id: number;
  stepId: number;
  testId?: number;
  chemicalId?: number;
  testName?: string;
  chemicalName?: string;
  testValue?: string;
  chemicalValue?: string;
  valueAddedDate?: string;
  status?: string;
  date?: string;
  time?: string;
  value?: string;
}

interface Test {
  id: number;
  testName: string;
  date?: string;
  time?: string;
  value?: string;
}

interface Step {
  id: number;
  stepName: string;
}

interface InputValues {
  [id: number]: string;
}

const StepView: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const [inputValues, setInputValues] = useState<InputValues>({});
  const [pastTests, setPastTests] = useState<Test[]>([]);
  const [currentTests, setCurrentTests] = useState<Test[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"error" | "warning" | "info" | "success">();
  const [searchDate, setSearchDate] = useState<string>("");
  const [stepName, setStepName] = useState<string>("");
  const [stepValueMap, setStepValueMap] = useState<Map<number, StepValue>>(new Map());
  const [allStepValues, setAllStepValues] = useState<StepValue[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  const authcontext = React.useContext(AuthContext);
  const token = authcontext?.token || "";

  useEffect(() => {
    const fetchAllStepValues = async () => {
      try {
        const data = await getAllStepValues(token);
        setAllStepValues(data);
      } catch (error) {
        console.error("Error fetching all step values:", error);
        setAlertSeverity("error");
        setAlertMessage("Failed to fetch all step values. Please try again.");
        setOpenSnackbar(true);
      }
    };

    const fetchSteps = async () => {
      try {
        const data = await getSteps(token);
        setSteps(data);
      } catch (error) {
        console.error("Error fetching steps:", error);
        setAlertSeverity("error");
        setAlertMessage("Failed to fetch steps. Please try again.");
        setOpenSnackbar(true);
      }
    };

    fetchAllStepValues();
    fetchSteps();
  }, [token]);

  useEffect(() => {
    const fetchStepDetails = async () => {
      try {
        const step = steps.find((step: Step) => step.id === Number(stepId));
        if (step) {
          setStepName(step.stepName);
        }

        const stepValues = await getStepValuesByStepId(token, Number(stepId || "0"));
        const valueMap = new Map<number, StepValue>();
        stepValues.forEach((value: StepValue) => {
          valueMap.set(value.id, value);
        });
        setStepValueMap(valueMap);

        const pastTestsData = stepValues
          .filter((value: StepValue) => value.testValue || value.chemicalValue)
          .map((value: StepValue) => ({
            id: value.id,
            testName: value.testName || value.chemicalName || "Unknown",
            date: value.date,
            time: value.time,
            value: value.testValue || value.chemicalValue || "",
          }));

        const currentTestsData = stepValues
          .filter((value: StepValue) => !value.testValue && !value.chemicalValue)
          .map((value: StepValue) => ({
            id: value.id,
            testName: value.testName || value.chemicalName || "Unknown",
            date: value.date,
            time: value.time,
          }));

        setPastTests(pastTestsData);
        setCurrentTests(currentTestsData);
      } catch (error) {
        console.error("Error fetching step details or values:", error);
      }
    };

    if (stepId) {
      fetchStepDetails();
    }
  }, [stepId, steps, token]);

  const handleInputChange = (id: number, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const formatDateTime = (datetimeStr: string | undefined) => {
    if (!datetimeStr) return { date: "", time: "" };

    try {
      const datetime = new Date(datetimeStr);
      if (isNaN(datetime.getTime())) {
        throw new Error("Invalid date format");
      }

      const date = datetime.toISOString().split('T')[0];
      const time = datetime.toLocaleTimeString();
      return { date, time };
    } catch (error) {
      console.error("Error formatting datetime:", error);
      return { date: "", time: "" };
    }
  };

  const handleConfirmSingleTest = async (id: number, testName: string) => {
    if (!inputValues[id]) {
      setAlertSeverity("error");
      setAlertMessage(`Please fill in the value for ${testName}.`);
      setOpenSnackbar(true);
      return;
    }

    const isDuplicate = pastTests.some(
      (test) => test.testName === testName && test.value === inputValues[id]
    );

    if (isDuplicate) {
      setAlertSeverity("error");
      setAlertMessage(
        `The value "${inputValues[id]}" for ${testName} already exists. Please enter a different value.`
      );
      setOpenSnackbar(true);
      return;
    }

    try {
      const stepValue = stepValueMap.get(id);

      if (!stepValue || stepValue.id === undefined || stepValue.id === null) {
        throw new Error(`Could not find step value or ID for test/chemical: ${testName}`);
      }

      const isTest = !!stepValue.testName;
      const value = Number(inputValues[id]);

      await updateStepValue(
        stepValue.id,
        Number(stepId || "0"),
        isTest ? value : null,
        !isTest ? value : null,
        token
      );

      const updatedStepValue: StepValue = {
        ...stepValue,
        testValue: isTest ? inputValues[id] : undefined,
        chemicalValue: !isTest ? inputValues[id] : undefined,
        valueAddedDate: new Date().toISOString(),
      };

      setAllStepValues((prev) => [...prev, updatedStepValue]);

      const currentTest = currentTests.find((test) => test.id === id);
      if (currentTest) {
        const updatedTest: Test = {
          id: currentTest.id,
          testName: currentTest.testName,
          date: currentTest.date,
          time: currentTest.time,
          value: inputValues[id],
        };
        setPastTests((prev) => [...prev, updatedTest]);
      }

      setCurrentTests((prev) => prev.filter((test) => test.id !== id));

      setInputValues((prev) => {
        const newValues = { ...prev };
        delete newValues[id];
        return newValues;
      });

      setAlertSeverity("success");
      setAlertMessage(`Value for ${testName} added successfully.`);
      setOpenSnackbar(true);
    } catch (error) {
      console.error(`Error updating value for ${testName}:`, error);
      setAlertSeverity("error");
      setAlertMessage(`Failed to update value for ${testName}. Please try again.`);
      setOpenSnackbar(true);
    }
  };

  const handleCancelClick = () => {
    navigate(-1);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (!newDate || /^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
      setSearchDate(newDate);
    }
  };

  const filteredStepValues = allStepValues.filter((stepValue) => {
    if (!searchDate) return true;
    if (!stepValue.valueAddedDate) return false;

    const { date } = formatDateTime(stepValue.valueAddedDate);
    return date === searchDate;
  });

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const getStepNameById = (stepId: number) => {
    const step = steps.find((step) => step.id === stepId);
    return step ? step.stepName : "Unknown Step";
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - filteredStepValues.length);

  return (
    <Box sx={{ padding: 2, backgroundColor: "#F1F2F7", width: "full", boxSizing: "border-box" }}>
      <Grid item xs={12} md={8}>
        <Paper 
          sx={{ 
            padding: 2, 
            height: "96%",
            backgroundColor: "white",
            borderRadius: 3,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", fontSize: "1.2rem" ,textAlign: "center" }}>
            Add new values - {stepName}
          </Typography>
          <Box sx={{ position: "absolute", top: 130, right: 50 }}>
            <Button
              variant="contained"
              onClick={handleCancelClick}
              sx={{
                backgroundColor: "#102D4D",
                fontSize: "12px",
                height: "30px",
              }}
            >
              Back
            </Button>
          </Box>
          <Box sx={{
            gap: 2,
            padding: 2,
            borderRadius: "8px",
            width: "50%",
            margin: "0 auto",
          }}>
            {currentTests.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: "left" }}>
                No test or chemical values to add.
              </Typography>
            ) : (
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                padding: 2,
                borderRadius: "8px",
              }}>
                {currentTests.map((test) => (
                  <Box
                    key={test.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        width: "45%",
                        textAlign: "left",
                      }}
                    >
                      {test.testName}
                    </Typography>

                    <TextField
                      variant="outlined"
                      size="small"
                      sx={{ width: "30%" }}
                      value={inputValues[test.id] || ""}
                      onChange={(e) => handleInputChange(test.id, e.target.value)}
                    />

                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleConfirmSingleTest(test.id, test.testName)}
                      sx={{
                        backgroundColor: "#102D4D",
                        color: "white",
                        fontSize: "12px",
                        height: "30px",
                        ml: 2,
                      }}
                    >
                      Confirm
                    </Button>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Paper>
      </Grid>
      <br></br>
      <Grid item xs={12} md={8}>
        <Paper 
          sx={{ 
            padding: 2, 
            height: "96%",
            backgroundColor: "white",
            borderRadius: 3,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between" }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", fontSize: "1rem" }}>
              Past Test Values
            </Typography>
            
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <TextField
                type="date"
                variant="outlined"
                size="small"
                value={searchDate}
                onChange={handleDateChange}
                inputProps={{
                  max: new Date().toISOString().split('T')[0],
                }}
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
                }}
              />
              {searchDate && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setSearchDate("")}
                  sx={{
                    backgroundColor: "#102D4D",
                    color: "white",
                    fontSize: "12px",
                    height: "30px",
                    ml: 2,
                  }}
                >
                  Clear
                </Button>
              )}
            </Box>
          </Box>

          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                  Stage Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "0.9rem" }} align="center">
                  Test/Chemical Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "0.9rem" }} align="center">
                  Value
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "0.9rem" }} align="center">
                  Date
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "0.9rem" }} align="center">
                  Time
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredStepValues.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : filteredStepValues
              ).map((stepValue, index) => {
                const isTest = !!stepValue.testName;
                const displayValue = isTest ? stepValue.testValue : stepValue.chemicalValue;
                const { date, time } = formatDateTime(stepValue.valueAddedDate);
                const stepName = getStepNameById(stepValue.stepId);

                return (
                  <TableRow key={index}>
                    <TableCell sx={{ fontSize: "0.8rem" }}>
                      {stepName}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.8rem", width: 250 }} align="center">
                      {stepValue.testName || stepValue.chemicalName || "Unknown"}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.8rem", width: 250 }} align="center">
                      {displayValue}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.8rem", width: 250 }} align="center">
                      {date}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.8rem", width: 250 }} align="center">
                      {time}
                    </TableCell>
                  </TableRow>
                );
              })}
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
                    ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
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
                  count={filteredStepValues.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={alertSeverity}
          sx={{ width: "100%", fontFamily: "Poppins, sans-serif" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StepView;