import React, { useState, useEffect, useContext } from "react";

import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Box,
  Grid,
  Typography,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Button,
 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  getTests,
  getChemicals,
  getSteps,
  updateStepOrder,
  createStepValue,
} from "./server/flow-customisationAPI";
import { AuthContext } from "../../components/auth/AuthProvider";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import AddTestDialog from "../Flow Customization/addTest";
import AddChemicalDialog from "../Flow Customization/addChemical";
import AddStepDialog from "../Flow Customization/addStep";
import { useDrag, useDrop } from "react-dnd/dist/hooks";
import { DndProvider } from "react-dnd/dist/core/DndProvider";

enum ItemType {
  CHEMICAL = "chemical",
  TEST = "test",
  STEP = "step",
}

interface StepItem {
  id: number;
  title: string;
  items: Array<{
    name: string;
    type: ItemType;
    id?: number;
  }>;
  confirmed: boolean;
}

interface Test {
  id: number;
  name: string;
}

interface Chemical {
  id: number;
  name: string;
}

interface DraggableStepProps {
  step: StepItem;
  index: number;
  moveStep: (fromIndex: number, toIndex: number) => void;
  onDropItem: (stepId: number, itemName: string, itemType: ItemType, itemId: number) => void;
  onRemoveItem: (stepId: number, itemName: string) => void;
  isEditing: boolean;
  setSteps: React.Dispatch<React.SetStateAction<StepItem[]>>;
}

interface DraggableItemProps {
  name: string;
  type: ItemType;
  id: number;
}

const DraggableStep: React.FC<DraggableStepProps> = ({
  step,
  index,
  moveStep,
  onDropItem,
  onRemoveItem,
  isEditing,
  setSteps,
}) => {
  const [, dragRef] = useDrag({
    type: ItemType.STEP,
    item: { index },
    canDrag: isEditing,
  });

  const [, dropRef] = useDrop({
    accept: ItemType.STEP,
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveStep(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => dragRef(dropRef(node))}>
      <Step
        step={step}
        onDropItem={onDropItem}
        onRemoveItem={onRemoveItem}
        setSteps={setSteps}
      />
    </div>
  );
};

interface StepProps {
  step: StepItem;
  onDropItem: (stepId: number, itemName: string, itemType: ItemType, itemId: number) => void;
  onRemoveItem: (stepId: number, itemName: string) => void;
  setSteps: React.Dispatch<React.SetStateAction<StepItem[]>>;
}

const Step: React.FC<StepProps> = ({ step, onDropItem, onRemoveItem, setSteps }) => {
  const [{ isOver }, dropRef] = useDrop({
    accept: [ItemType.CHEMICAL, ItemType.TEST],
    drop: (item: DraggableItemProps) => {
      onDropItem(step.id, item.name, item.type, item.id);
    },
    collect: (monitor: import("react-dnd").DropTargetMonitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const authcontext = useContext(AuthContext);
  const token: string | undefined = authcontext?.token;
  const navigate = useNavigate();

  const handleStepClick = () => {
    navigate(`/user/flow/step/${step.id}`);
  };

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertSeverity, setAlertSeverity] = useState<"error" | "warning" | "info" | "success">();

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleConfirmClick = async () => {
    if (!token) {
      setAlertSeverity("error");
      setAlertMessage("No authentication token found. Please log in.");
      setOpenSnackbar(true);
      return;
    }

    try {
      for (const item of step.items) {
        const payload = {
          stepId: step.id,
          testId: item.type === ItemType.TEST ? item.id : undefined,
          chemicalId: item.type === ItemType.CHEMICAL ? item.id : undefined,
        };

        await createStepValue(token, payload);
      }

      // Clear the step items but keep the step available for new items
      setSteps((prevSteps) =>
        prevSteps.map((s) =>
          s.id === step.id ? { ...s, items: [] } : s
        )
      );

      setAlertSeverity("success");
      setAlertMessage("Step confirmed and values updated!");
      setOpenSnackbar(true);
    } catch (error) {
      setAlertSeverity("error");
      setAlertMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      );
      setOpenSnackbar(true);
      console.error("Error confirming step:", error);
    }
  };

  const hasItems = (step.items || []).length > 0;

  return (
    <Box
      ref={dropRef}
      sx={{
        padding: 2,
        backgroundColor: isOver ? "#d3ffd8" : "white",
        borderRadius: 3,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        height: 180,
        width: 180,
        transition: "background-color 0.2s",
        border: "1px solid #e0e0e0",
      }}
    >
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 1,
        }}
      >
        <Typography
          variant="subtitle1"
          onClick={handleStepClick}
          sx={{
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
            color: "#102D4D",
          }}
        >
          {step.title}
        </Typography>
        {hasItems && (
          <IconButton
            onClick={handleConfirmClick}
            sx={{
              backgroundColor: "#102D4D",
              color: "white",
              width: "24px",
              height: "24px",
              borderRadius: "3px",
              "&:hover": {
                backgroundColor: "#4072AF",
              },
            }}
          >
            <CheckIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Box
        sx={{
          maxHeight: "100px",
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        <Box component="ul" sx={{ listStyleType: "none", padding: 0, margin: 0 }}>
          {step.items.map((item, index) => (
            <Box
              component="li"
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                margin: "4px 0",
                padding: "4px 8px",
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" sx={{ fontSize: "12px" }}>
                {item.name}
              </Typography>
              <IconButton
                size="small"
                onClick={() => onRemoveItem(step.id, item.name)}
                sx={{
                  color: "#ff4444",
                  width: "20px",
                  height: "20px",
                  "&:hover": {
                    color: "#cc0000",
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const DraggableItem: React.FC<DraggableItemProps> = ({ name, type, id }) => {
  const [, dragRef] = useDrag({
    type,
    item: { name, type, id },
  });

  return (
    <Box
      ref={dragRef}
      sx={{
        marginBottom: "8px",
        cursor: "grab",
        padding: "6px 8px",
        backgroundColor: type === ItemType.TEST ? "#F3FAFD" : "#DFF5FF",
        borderRadius: 1,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        "&:hover": {
          backgroundColor: type === ItemType.TEST ? "#E1F0F7" : "#D0EBFA",
        }
      }}
    >
      <Typography variant="body2" sx={{ fontSize: "12px" }}>
        {name}
      </Typography>
    </Box>
  );
};

const FlowCustomizationDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [steps, setSteps] = useState<StepItem[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const [openTestDialog, setOpenTestDialog] = useState(false);
  const [openChemicalDialog, setOpenChemicalDialog] = useState(false);
  const [openStepDialog, setOpenStepDialog] = useState(false);
  const authcontext = useContext(AuthContext);
  const token = authcontext?.token;

  // Fetch data functions
  const fetchTests = async () => {
    if (!token) return;
    try {
      const data = await getTests(token);
      setTests(
        data.map((test: { id: number; testName: string }) => ({
          id: test.id,
          name: test.testName,
        }))
      );

    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };

  const fetchChemicals = async () => {
    if (!token) return;
    try {
      const data = await getChemicals(token);
      setChemicals(data.map((chemical: { id: number; chemicalName: string }) => ({
        id: chemical.id,
        name: chemical.chemicalName,
      })));
    } catch (error) {
      console.error("Error fetching chemicals:", error);
    }
  };

  const fetchSteps = async () => {
    if (!token) return;
    try {
      const data = await getSteps(token);
      setSteps(data.map((step: { id: number; stepName: string }) => ({
        id: step.id,
        title: step.stepName,
        items: [],
        confirmed: false,
      })));
    } catch (error) {
      console.error("Error fetching steps:", error);
    }
  };

  useEffect(() => {
    fetchTests();
    fetchChemicals();
    fetchSteps();
  }, [token]);

  const handleDropItem = (stepId: number, itemName: string, itemType: ItemType, itemId: number) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === stepId
          ? {
            ...step,
            items: [
              ...step.items,
              { name: itemName, type: itemType, id: itemId },
            ],
          }
          : step
      )
    );
  };

  const handleRemoveItem = (stepId: number, itemName: string) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === stepId
          ? { ...step, items: step.items.filter((item) => item.name !== itemName) }
          : step
      )
    );
  };

  const moveStep = async (fromIndex: number, toIndex: number) => {
    const updatedSteps = [...steps];
    const [removedStep] = updatedSteps.splice(fromIndex, 1);
    updatedSteps.splice(toIndex, 0, removedStep);

    setSteps(updatedSteps);

    const stepsToUpdate = updatedSteps.map((step, index) => ({
      id: step.id,
      stepOrder: index + 1,
    }));

    if (!token) {
      console.error("No authentication token found. Please log in.");
      return;
    }

    try {
      await updateStepOrder(token, stepsToUpdate);
      console.log("Step order updated successfully!");
    } catch (error) {
      console.error("Error updating step order:", error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ margin: "20px", minHeight: 'calc(100vh - 40px)' }}>
        <Grid container spacing={2} sx={{ alignItems: 'stretch', height: 'calc(100vh - 180px)' }}>
          {/* Left Section */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Readings Section */}
            <Paper sx={{
              flex: 1,
              padding: 2,
              marginBottom: 2,
              overflowY: "auto",
              backgroundColor: "white",
              borderRadius: 3,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              height: '50%'
            }}>
              <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 2,
              }}>
                <Typography variant="h6" sx={{ fontSize: "14px", fontWeight: "bold" }}>
                  Readings
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setOpenTestDialog(true)}
                  sx={{
                    backgroundColor: "#102D4D",
                    fontSize: "12px",
                    height: "30px",
                  }}
                  startIcon={<AddIcon fontSize="small" />}
                >
                  Add
                </Button>
              </Box>
              <Box component="ul" sx={{ listStyleType: "none", padding: 0, margin: 0 }}>
                {tests.map((test) => (
                  <Box component="li" key={test.id} sx={{ marginBottom: 1 }}>
                    <DraggableItem
                      name={test.name}
                      type={ItemType.TEST}
                      id={test.id}
                    />
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Chemicals Section */}
            <Paper sx={{
              flex: 1,
              padding: 2,
              overflowY: "auto",
              backgroundColor: "white",
              borderRadius: 3,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              height: '50%'
            }}>
              <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 2,
              }}>
                <Typography variant="h6" sx={{ fontSize: "14px", fontWeight: "bold" }}>
                  Chemicals
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setOpenChemicalDialog(true)}
                  sx={{
                    backgroundColor: "#102D4D",
                    fontSize: "12px",
                    height: "30px",
                  }}
                  startIcon={<AddIcon fontSize="small" />}
                >
                  Add
                </Button>
              </Box>
              <Box component="ul" sx={{ listStyleType: "none", padding: 0, margin: 0 }}>
                {chemicals.map((chemical) => (
                  <Box component="li" key={chemical.id} sx={{ marginBottom: 1 }}>
                    <DraggableItem
                      name={chemical.name}
                      type={ItemType.CHEMICAL}
                      id={chemical.id}
                    />
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
          {/* Right Section - Stages */}
          <Grid item xs={12} md={8} sx={{ height: '100%' }}>
            <Paper
              sx={{
                padding: 2,
                height: '100%',
                minHeight: 0,
                backgroundColor: "white",
                borderRadius: 3,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header section remains the same */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 2,
                  flexShrink: 0,
                }}
              >
                <Typography variant="h5" sx={{ fontSize: "16px", fontWeight: "bold" }}>
                  Stages
                </Typography>

                <Box sx={{ display: "flex", gap: "10px" }}>
                <Button
  variant="contained"
  onClick={() => setOpenStepDialog(true)}  // Changed from navigate to setOpenStepDialog
  sx={{
    backgroundColor: "#102D4D",
    fontSize: "12px",
    height: "30px",
  }}
  startIcon={<AddIcon fontSize="small" />}
>
  Add
</Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/user/flow/prediction")}
                    sx={{
                      backgroundColor: "#102D4D",
                      fontSize: "12px",
                      height: "30px",
                    }}
                    startIcon={<InsertChartIcon fontSize="small" />}
                  >
                    Predict
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setIsEditing(!isEditing)}
                    sx={{
                      backgroundColor: isEditing ? "#4072AF" : "#102D4D",
                      fontSize: "12px",
                      height: "30px",
                    }}
                    startIcon={<EditIcon fontSize="small" />}
                  >
                    Edit
                  </Button>
                </Box>
              </Box>

              {/* Stages Flow with corrected alignment */}
              <Box sx={{
                flex: 1,
                overflowY: 'auto',
                paddingBottom: 2,
              }}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start', // Default to left alignment
                  gap: 4,
                  position: 'relative',
                  paddingLeft: 2,
                }}>
                  {Array.from({ length: Math.ceil(steps.length / 3) }).map((_, rowIndex) => {
                    const isEvenRow = rowIndex % 2 === 0;
                    const startIdx = rowIndex * 3;
                    const endIdx = Math.min(startIdx + 3, steps.length);
                    const rowItemCount = endIdx - startIdx;
                    const rowSteps = isEvenRow
                      ? steps.slice(startIdx, endIdx) // Left to right for even rows
                      : [...steps.slice(startIdx, endIdx)].reverse(); // Right to left for odd rows

                    return (
                      <Box
                        key={`row-${rowIndex}`}
                        sx={{
                          display: 'flex',
                          justifyContent: rowItemCount < 3 ? 'flex-start' : 'center', // Left-align if less than 3 items
                          width: '100%',
                          gap: 4,
                          position: 'relative',
                        }}
                      >
                        {rowSteps.map((step, colIndex) => {
                          const originalIndex = isEvenRow ? startIdx + colIndex : startIdx + (rowSteps.length - 1 - colIndex);
                          const isLastInRow = colIndex === rowSteps.length - 1;
                          const isFirstInRow = colIndex === 0;
                          const isLastItem = originalIndex === steps.length - 1;
                          const isSingleItemRow = rowItemCount === 1;

                          return (
                            <Box
                              key={step.id}
                              sx={{
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: { xs: '100%', sm: 'calc(50% - 16px)', md: isSingleItemRow ? '100%' : 'calc(33.33% - 22px)' },
                                minWidth: '200px',
                              }}
                            >
                              <DraggableStep
                                step={step}
                                index={originalIndex}
                                moveStep={moveStep}
                                onDropItem={handleDropItem}
                                onRemoveItem={handleRemoveItem}
                                isEditing={isEditing}
                                setSteps={setSteps}
                              />


                              {/* Right arrow (→) for left-to-right in even rows */}
                              {!isLastInRow && isEvenRow && rowItemCount > 1 && (
                                <Box sx={{
                                  position: 'absolute',
                                  top: '50%',
                                  right: '-22px',
                                  width: '20px',
                                  height: '2px',
                                  bgcolor: '#102D4D',
                                  '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    right: 0,
                                    top: '-4px',
                                    width: 0,
                                    height: 0,
                                    borderLeft: '6px solid #102D4D',
                                    borderTop: '5px solid transparent',
                                    borderBottom: '5px solid transparent',
                                  }
                                }} />
                              )}

                              {/* Left arrow (←) for right-to-left in odd rows */}
                              {!isFirstInRow && !isEvenRow && rowItemCount > 1 && (
                                <Box sx={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '-22px',
                                  width: '20px',
                                  height: '2px',
                                  bgcolor: '#102D4D',
                                  '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: '-4px',
                                    width: 0,
                                    height: 0,
                                    borderRight: '6px solid #102D4D',
                                    borderTop: '5px solid transparent',
                                    borderBottom: '5px solid transparent',
                                  }
                                }} />
                              )}

                              {/* Down arrow (↓) from last in even row to next row */}
                              {isLastInRow && !isLastItem && isEvenRow && rowItemCount > 1 && (
                                <Box sx={{
                                  position: 'absolute',
                                  bottom: '-22px',
                                  right: isSingleItemRow ? '50%' : '50%',
                                  width: '2px',
                                  height: '20px',
                                  bgcolor: '#102D4D',
                                  '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: '-4px',
                                    width: 0,
                                    height: 0,
                                    borderTop: '6px solid #102D4D',
                                    borderLeft: '5px solid transparent',
                                    borderRight: '5px solid transparent',
                                  }
                                }} />
                              )}

                              {/* Down arrow (↓) from first in odd row to next row */}
                              {isFirstInRow && !isLastItem && !isEvenRow && rowItemCount > 1 && (
                                <Box sx={{
                                  position: 'absolute',
                                  bottom: '-22px',
                                  left: isSingleItemRow ? '50%' : '50%',
                                  width: '2px',
                                  height: '20px',
                                  bgcolor: '#102D4D',
                                  '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: '-4px',
                                    width: 0,
                                    height: 0,
                                    borderTop: '6px solid #102D4D',
                                    borderLeft: '5px solid transparent',
                                    borderRight: '5px solid transparent',
                                  }
                                }} />
                              )}

                              {/* Special case: down arrow for single item rows */}
                              {isSingleItemRow && !isLastItem && (
                                <Box sx={{
                                  position: 'absolute',
                                  bottom: '-22px',
                                  left: '50%',
                                  width: '2px',
                                  height: '20px',
                                  bgcolor: '#102D4D',
                                  '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: '-4px',
                                    width: 0,
                                    height: 0,
                                    borderTop: '6px solid #102D4D',
                                    borderLeft: '5px solid transparent',
                                    borderRight: '5px solid transparent',
                                  }
                                }} />
                              )}
                            </Box>
                          );
                        })}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      {/* Add the dialogs */}
      <AddTestDialog
        open={openTestDialog}
        onClose={() => setOpenTestDialog(false)}
        onTestAdded={fetchTests}
      />
      <AddChemicalDialog
        open={openChemicalDialog}
        onClose={() => setOpenChemicalDialog(false)}
        onChemicalAdded={fetchChemicals}
      />
      <AddStepDialog
  open={openStepDialog}
  onClose={() => setOpenStepDialog(false)}
  onStepAdded={fetchSteps}  // This will refresh the steps list after adding a new one
/>
    </DndProvider>
  );
};


export default FlowCustomizationDashboard;