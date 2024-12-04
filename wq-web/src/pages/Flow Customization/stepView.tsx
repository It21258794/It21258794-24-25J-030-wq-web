import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, TextField, Button, Typography, Paper, Snackbar, Alert } from "@mui/material";
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

interface Test {
  testName: string;
  date: string;
  time: string;
  value?: string;
}

const StepView: React.FC = () => {
    const [testValues, setTestValues] = useState<{ [testName: string]: string }>({});
    const [pastTests, setPastTests] = useState<Test[]>([
      { testName: "pH Test", date: "2024-11-25", time: "09:00 AM", value: "7.0" },
      { testName: "Hardness Test", date: "2024-11-26", time: "10:30 AM", value: "120 ppm" },
      { testName: "Alkalinity Test", date: "2024-11-26", time: "02:00 PM", value: "80 ppm" },   { testName: "pH Test", date: "2024-11-25", time: "09:00 AM", value: "7.0" },
      { testName: "Hardness Test", date: "2024-11-26", time: "10:30 AM", value: "120 ppm" },
     
    ]);
    const [currentTests, setCurrentTests] = useState<Test[]>([
      { testName: "Lime", date: "2024-11-27", time: "10:00 AM" },
      { testName: "Chlorine", date: "2024-11-27", time: "11:00 AM" },
    ]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState<"error" | "warning" | "info" | "success">();
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [searchDate, setSearchDate] = useState<string>('');
    const navigate = useNavigate();
  
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
                    <hr
                        style={{
                            border: "1px solid #ccc",
                            margin: "10px 0",
                            opacity: 0.5,
                        }}
                    />
                 <Box
    sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 2,
    }}
>
    <Typography variant="h5" gutterBottom>
        All Tests
    </Typography>
    <TextField
        label="Search by Date"
        type="date"
        value={searchDate}
        onChange={handleDateChange}
        sx={{
            display: 'inline-block',
            width: '250px', // Optional: Adjust width as needed
            alignItems: 'right',

        }}
        InputLabelProps={{
            shrink: true,
        }}
        variant="outlined"
        size="small"
    />
</Box>


                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            "&::-webkit-scrollbar": {
                                width: "8px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "#7F7F7F",
                                borderRadius: "4px",
                            },
                            "&::-webkit-scrollbar-track": {
                                background: "#f1f1f1",
                                borderRadius: "4px",
                            },
                        }}
                    >
                        {filteredPastTests.length === 0 ? (
                            <Typography variant="body1">No past tests available.</Typography>
                        ) : (
                            <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#DFF5FF', color: 'white' }}>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#102D4D' }}>Test</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#102D4D' }}>Date</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#102D4D' }}>Time</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#102D4D' }}>Value</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredPastTests.map((test) => (
                                        <TableRow key={test.testName}>
                                            <TableCell>{test.testName}</TableCell>
                                            <TableCell>{test.date}</TableCell>
                                            <TableCell>{test.time}</TableCell>
                                            <TableCell>{test.value}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </Box>
                </Paper>
            </Grid>

            {/* Snackbar for feedback messages */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={alertSeverity}
                    sx={{ width: '100%' }}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default StepView;
