import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Grid, TextField, Button, Typography, Paper, Snackbar, Alert } from "@mui/material";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { getStepValuesByStepId, getSteps, updateStepValue } from "../../server/flow-customisation/flow-customisationAPI";

interface StepValue {
  id: number;
  testName?: string;
  chemicalName?: string;
  date?: string;
  time?: string;
  value?: string;
  testId?: number;
  chemicalId?: number;
}

interface Test {
  testName: string;
  date?: string;
  time?: string;
  value?: string;
}

interface Step {
  id: number;
  stepName: string;
}

// This uses ID as the key to ensure uniqueness
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
  const navigate = useNavigate();

  // Token constant - could be moved to environment variable or auth context
  const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3Mzk3MjE5NDJ9.tiglE-V_R3yl930QOhdtTEejAzGLndY2g3tEaCZHthU";

  // Fetch step details and step values from the backend
  useEffect(() => {
    const fetchStepDetails = async () => {
      try {
        // Fetch step details
        const steps = await getSteps(TOKEN);
        const step = steps.find((step: Step) => step.id === Number(stepId));
        if (step) {
          setStepName(step.stepName);
        }

        // Fetch step values
        const stepValues = await getStepValuesByStepId(Number(stepId), TOKEN);
        
        // Create a map for quick lookup by ID
        const valueMap = new Map();
        stepValues.forEach((value: StepValue) => {
          valueMap.set(value.id, value);
        });
        setStepValueMap(valueMap);

        // Map step values to pastTests and currentTests
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
  }, [stepId]);

  // Handle input value change
  const handleInputChange = (id: number, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle individual test confirmation
  const handleConfirmSingleTest = async (id: number, testName: string) => {
    // Check if the value is empty
    if (!inputValues[id]) {
      setAlertSeverity("error");
      setAlertMessage(`Please fill in the value for ${testName}.`);
      setOpenSnackbar(true);
      return;
    }
  
    // Check if the same value already exists for this test/chemical
    const isDuplicate = pastTests.some(
      (test) =>
        test.testName === testName && test.value === inputValues[id]
    );
  
    if (isDuplicate) {
      setAlertSeverity("error");
      setAlertMessage(
        `The value "${inputValues[id]}" for ${testName} already exists. Please enter a different value.`
      );
      setOpenSnackbar(true);
      return;
    }
  
    // Add to pending submissions
    setPendingSubmissions((prev) => new Set([...prev, id]));
  
    try {
      // Get the step value from our map
      const stepValue = stepValueMap.get(id);
  
      // Validate stepValue
      if (!stepValue || stepValue.id === undefined || stepValue.id === null) {
        throw new Error(`Could not find step value or ID for test/chemical: ${testName}`);
      }
  
      // Determine if this is a test or chemical based on the actual properties in stepValue
      const isTest = !!stepValue.testName;
      const value = Number(inputValues[id]);
  
      // Pass the correct ID to updateStepValue
      await updateStepValue(
        stepValue.id,
        Number(stepId),
        isTest ? value : null,
        !isTest ? value : null,
        TOKEN
      );
  
      // Add to past tests
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
  
      // Remove from current tests
      setCurrentTests((prev) => prev.filter((test) => test.id !== id));
  
      // Clear the value for this test
      setInputValues((prev) => {
        const newValues = { ...prev };
        delete newValues[id];
        return newValues;
      });
  
      // Show success message
      setAlertSeverity("success");
      setAlertMessage(`Value for ${testName} added successfully.`);
      setOpenSnackbar(true);
    } catch (error) {
      console.error(`Error updating value for ${testName}:`, error);
      setAlertSeverity("error");
      setAlertMessage(`Failed to update value for ${testName}. Please try again.`);
      setOpenSnackbar(true);
    } finally {
      // Remove from pending submissions
      setPendingSubmissions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };
  // Handle cancel action
  const handleCancelClick = () => {
    navigate(-1);
  };

  // Handle date change for filtering past tests
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDate(e.target.value);
  };

  // Filter past tests based on selected date
  const filteredPastTests = pastTests.filter((test) =>
    searchDate ? test.date === searchDate : true
  );

  // Close the snackbar
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: "#F1F2F7",
        width: "full",
        boxSizing: "border-box",
      }}
    >
      <Grid item xs={12} md={8}>
        {/* Right side: Add Values to Step form */}
        <Paper
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            position: "relative",
            width: "93%",
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: "2%",
          }}
        >
          {/* Back button at the top-right corner */}
          <Box
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
            }}
          >
            <Button
              variant="outlined"
              sx={{
                backgroundColor: "#F1F2F7",
                color: "#8F8F8F",
              }}
              onClick={handleCancelClick}
            >
              Back
            </Button>
          </Box>
          <Typography variant="h4" color="black" gutterBottom>
            {stepName}
          </Typography>
          <Box
            sx={{
              gap: 2,
              backgroundColor: "#F1F2F7",
              padding: 2,
              borderRadius: "8px",
              width: "50%",
              margin: "0 auto",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
              Add new Values to {stepName}
            </Typography>
            {/* Tests List with Input Fields */}
            {currentTests.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: "left" }}>
                No test or chemical values to add.
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  padding: 2,
                  borderRadius: "8px",
                }}
              >
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
                     sx={{
                       width: "30%",
                     }}
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

          {/* Past Tests Table */}
          <Box
            sx={{
              marginTop: 4,
              backgroundColor: "#F1F2F7",
              padding: 2,
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
              Past Test Values
            </Typography>
            <TextField
              type="date"
              variant="outlined"
              size="small"
              sx={{ marginBottom: 2 }}
              value={searchDate}
              onChange={handleDateChange}
            />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPastTests.map((test, index) => (
                  <TableRow key={index}>
                    <TableCell>{test.testName}</TableCell>
                    <TableCell>{test.date}</TableCell>
                    <TableCell>{test.time}</TableCell>
                    <TableCell>{test.value}</TableCell>
                  </TableRow>
                ))}
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