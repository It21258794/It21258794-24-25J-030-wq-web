import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Grid, TextField, Button, Typography, Paper, Snackbar, Alert } from "@mui/material";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { getStepValuesByStepId ,getSteps} from "../../server/flow-customisation/flow-customisationAPI"; // Import the API function

interface StepValue {
  id: number;
  testName?: string;
  chemicalName?: string;
  date?: string;
  time?: string;
  value?: string;
}

interface Test {
  testName: string;
  date?: string;
  time?: string;
  value?: string;
}

const StepView: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>(); // Get stepId from the URL
  const [testValues, setTestValues] = useState<{ [testName: string]: string }>({});
  const [pastTests, setPastTests] = useState<Test[]>([]);
  const [currentTests, setCurrentTests] = useState<Test[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"error" | "warning" | "info" | "success">();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [searchDate, setSearchDate] = useState<string>("");
  const navigate = useNavigate();

  // Fetch step values from the backend
  useEffect(() => {
    const fetchStepValues = async () => {
      try {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3MzkzMjM5Njl9.9CDEkqzgb1kAergh_iSLel6LLpABb6alMvZ9PcO7rz4";
        const stepValues = await getStepValuesByStepId(Number(stepId), token);

        // Map step values to pastTests and currentTests
        const pastTestsData = stepValues
          .filter((value: StepValue) => value.value) // Filter tests with values (past tests)
          .map((value: StepValue) => ({
            testName: value.testName || value.chemicalName || "Unknown",
            date: value.date,
            time: value.time,
            value: value.value,
          }));

        const currentTestsData = stepValues
          .filter((value: StepValue) => !value.value) // Filter tests without values (current tests)
          .map((value: StepValue) => ({
            testName: value.testName || value.chemicalName || "Unknown",
            date: value.date,
            time: value.time,
          }));

        setPastTests(pastTestsData);
        setCurrentTests(currentTestsData);
      } catch (error) {
        console.error("Error fetching step values:", error);
        setAlertSeverity("error");
        setAlertMessage("Failed to fetch step values. Please try again.");
        setOpenSnackbar(true);
      }
    };

    fetchStepValues();
  }, [stepId]);

  // Handle input value change
  const handleInputChange = (testName: string, value: string) => {
    setTestValues((prev) => ({
      ...prev,
      [testName]: value,
    }));
  };

  // Handle form submission
  const handleConfirmClick = () => {
    setIsButtonDisabled(true);

    // Check if any input is empty
    if (currentTests.some((test) => !testValues[test.testName])) {
      setAlertSeverity("error");
      setAlertMessage("Please fill in all test values.");
      setOpenSnackbar(true);
      return;
    }

    // Add current tests to past tests
    const updatedPastTests = currentTests.map((test) => ({
      ...test,
      value: testValues[test.testName],
    }));
    setPastTests((prev) => [...prev, ...updatedPastTests]);

    // Clear current test values and reset the current tests
    setTestValues({});
    setCurrentTests([]);

    // Show success message
    setAlertSeverity("success");
    setAlertMessage("Test values added successfully.");
    setOpenSnackbar(true);
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
        {/* Right side: Add Values to Coagulation form */}
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
            Coagulation
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
              Add new Values to Coagulation
            </Typography>
            {/* Tests List with Input Fields */}
            {currentTests.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: "left" }}>
                No test to add values.
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
                    key={test.testName}
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
                        marginLeft: "18%",
                        width: "30%",
                      }}
                      value={testValues[test.testName] || ""}
                      onChange={(e) => handleInputChange(test.testName, e.target.value)}
                    />
                  </Box>
                ))}
              </Box>
            )}

            {/* Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                gap: 2,
                marginTop: 3,
                marginLeft: "77%",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#102D4D",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#154273",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  },
                }}
                onClick={handleConfirmClick}
                disabled={isButtonDisabled}
              >
                Confirm
              </Button>
            </Box>
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
                  <TableCell>Test Name</TableCell>
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