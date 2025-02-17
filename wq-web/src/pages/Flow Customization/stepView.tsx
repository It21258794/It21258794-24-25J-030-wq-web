import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Grid, TextField, Button, Typography, Paper, Snackbar, Alert } from "@mui/material";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { getStepValuesByStepId, getSteps, updateStepValue, getAllStepValues } from "../../server/flow-customisation/flow-customisationAPI";

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
  const [pendingSubmissions, setPendingSubmissions] = useState<Set<number>>(new Set());
  const [searchDate, setSearchDate] = useState<string>("");
  const [stepName, setStepName] = useState<string>("");
  const [stepValueMap, setStepValueMap] = useState<Map<number, StepValue>>(new Map());
  const [allStepValues, setAllStepValues] = useState<StepValue[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const navigate = useNavigate();

  const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3Mzk4MTgwMTl9.Lrc3JYMMhIFxhhAqmL0gMjunClfGuyKvW_ZVofgvI2Q";

  useEffect(() => {
    const fetchAllStepValues = async () => {
      try {
        const data = await getAllStepValues(TOKEN);
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
        const data = await getSteps(TOKEN);
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
  }, []);

  useEffect(() => {
    const fetchStepDetails = async () => {
      try {
        const step = steps.find((step: Step) => step.id === Number(stepId));
        if (step) {
          setStepName(step.stepName);
        }

        const stepValues = await getStepValuesByStepId(Number(stepId), TOKEN);
        
        const valueMap = new Map();
        stepValues.forEach((value: StepValue) => {
          valueMap.set(value.id, value);
        });
        setStepValueMap(valueMap);

        const pastTestsData = stepValues
          .filter((value: StepValue) => value.value)
          .map((value: StepValue) => ({
            testName: value.testName || value.chemicalName || "Unknown",
            date: value.date,
            time: value.time,
            value: value.value,
          }));

        const currentTestsData = stepValues
          .filter((value: StepValue) => !value.value)
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
        setAlertSeverity("error");
        setAlertMessage("Failed to fetch step details or values. Please try again.");
        setOpenSnackbar(true);
      }
    };

    if (stepId) {
      fetchStepDetails();
    }
  }, [stepId, steps]);

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
      
      // Format date as YYYY-MM-DD for consistency
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
  
    setPendingSubmissions((prev) => new Set([...prev, id]));
  
    try {
      const stepValue = stepValueMap.get(id);
  
      if (!stepValue || stepValue.id === undefined || stepValue.id === null) {
        throw new Error(`Could not find step value or ID for test/chemical: ${testName}`);
      }
  
      const isTest = !!stepValue.testName;
      const value = Number(inputValues[id]);
  
      await updateStepValue(
        stepValue.id,
        Number(stepId),
        isTest ? value : null,
        !isTest ? value : null,
        TOKEN
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
        const updatedTest = {
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
    } finally {
      setPendingSubmissions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
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

  return (
    <Box sx={{ padding: 2, backgroundColor: "#F1F2F7", width: "full", boxSizing: "border-box" }}>
      <Grid item xs={12} md={8}>
        <Paper sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          position: "relative",
          width: "93%",
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: "2%",
        }}>
          <Box sx={{ position: "absolute", top: 16, right: 16 }}>
            <Button
              variant="outlined"
              sx={{ backgroundColor: "#F1F2F7", color: "#8F8F8F" }}
              onClick={handleCancelClick}
            >
              Back
            </Button>
          </Box>
          
          <Typography variant="h4" color="black" gutterBottom>
            {stepName}
          </Typography>

          <Box sx={{
            gap: 2,
            backgroundColor: "#F1F2F7",
            padding: 2,
            borderRadius: "8px",
            width: "50%",
            margin: "0 auto",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}>
            <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
              Add new Values to {stepName}
            </Typography>

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
                      sx={{
                        backgroundColor: "#102D4D",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#154273",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        },
                        ml: 2,
                      }}
                      onClick={() => handleConfirmSingleTest(test.id, test.testName)}
                      disabled={pendingSubmissions.has(test.id)}
                    >
                      Confirm
                    </Button>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <Box sx={{
            marginTop: 4,
            backgroundColor: "#F1F2F7",
            padding: 2,
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}>
            <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
              Past Test Values
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
              <TextField
                type="date"
                variant="outlined"
                size="small"
                value={searchDate}
                onChange={handleDateChange}
                inputProps={{
                  max: new Date().toISOString().split('T')[0]
                }}
                sx={{ width: '200px' }}
              />
              {searchDate && (
                <Button
              sx={{ backgroundColor: "#F1F2F7", color: "#8F8F8F",marginLeft: 1 }}
                  variant="outlined"
                  size="medium"
                  onClick={() => setSearchDate("")}
                >
                  Clear Filter
                </Button>
              )}
            </Box>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Step Name</TableCell>
                  <TableCell>Test/Chemical Name</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
  {filteredStepValues.length > 0 ? (
    filteredStepValues.map((stepValue, index) => {
      const isTest = !!stepValue.testName;
      const rowColor = isTest ? "#F3FAFD" : "#DFF5FF"; // Updated colors
      const displayValue = isTest ? stepValue.testValue : stepValue.chemicalValue;
      const { date, time } = formatDateTime(stepValue.valueAddedDate);
      const stepName = getStepNameById(stepValue.stepId);

      return (
        <TableRow
          key={index}
          sx={{
            backgroundColor: rowColor,
            "&:hover": {
              backgroundColor: isTest ? "#E0F2F7" : "#C2E7FF", // Optional: Adjust hover colors
            },
          }}
        >
          <TableCell>{index + 1}</TableCell>
          <TableCell>{stepName}</TableCell>
          <TableCell>{stepValue.testName || stepValue.chemicalName || "Unknown"}</TableCell>
          <TableCell>{displayValue}</TableCell>
          <TableCell>{date}</TableCell>
          <TableCell>{time}</TableCell>
        </TableRow>
      );
    })
  ) : (
    <TableRow>
      <TableCell colSpan={6} align="center">
        No data available
      </TableCell>
    </TableRow>
  )}
</TableBody>
            </Table>
          </Box>
        </Paper>
      </Grid>

      {/* Snackbar for alerts */}
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