import React, { useState, useEffect } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Tooltip from "@mui/material/Tooltip";
import { FaTrash, FaPlus, FaEdit, FaCheck, FaChartArea } from "react-icons/fa";
import { Box, Grid, Typography, Paper, IconButton } from "@mui/material";
import { Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  getTests,
  getChemicals,
  getSteps,
  updateStepOrder,
  createStepValue,
} from "./server/flow-customisationAPI";
import { AuthContext } from "../../components/auth/AuthProvider";

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
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });
  const authcontext = React.useContext(AuthContext);
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
  
      setSteps((prevSteps) =>
        prevSteps.map((s) =>
          s.id === step.id ? { ...s, confirmed: true, items: [] } : s
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
    <Paper
      ref={dropRef}
      sx={{
        padding: 2,
        backgroundColor: isOver ? "#d3ffd8" : "#F1F2F7",
        borderRadius: 1,
        boxShadow: 1,
        height: 180,
        width: 180,
        transition: "background-color 0.2s",
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" onClick={handleStepClick} style={{ cursor: "pointer" }}>
          {step.title}
        </Typography>
        {hasItems && !step.confirmed && (
          <IconButton
            onClick={handleConfirmClick}
            sx={{
              backgroundColor: "#102D4D",
              color: "white",
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#4072AF",
                color: "white",
              },
            }}
          >
            <FaCheck />
          </IconButton>
        )}
      </div>

      <div
        style={{
          maxHeight: "100px",
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {step.items.map((item, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                margin: "5px 0",
              }}
            >
              {item.name}
              <IconButton
                size="small"
                onClick={() => onRemoveItem(step.id, item.name)}
                style={{ color: "#4072AF" }}
              >
                <FaTrash />
              </IconButton>
            </li>
          ))}
        </ul>
      </div>
    </Paper>
  );
};

const DraggableItem: React.FC<DraggableItemProps> = ({ name, type, id }) => {
  const [, dragRef] = useDrag({
    type,
    item: { name, type, id },
  });

  return (
    <div ref={dragRef} style={{ marginBottom: "10px", cursor: "grab" }}>
      {name}
    </div>
  );
};

const FlowCustomizationDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [steps, setSteps] = useState<StepItem[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const authcontext = React.useContext(AuthContext);
  const token: string | undefined = authcontext?.token;

  useEffect(() => {
    const fetchTests = async () => {
      if (!token) {
        console.error("No authentication token found. Please log in.");
        return;
      }

      try {
        const data = await getTests(token);
        const testData = data.map((test: { id: number; testName: string }) => ({
          id: test.id,
          name: test.testName,
        }));
        setTests(testData);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    fetchTests();
  }, [token]);

  useEffect(() => {
    const fetchChemicals = async () => {
      if (!token) {
        console.error("No authentication token found. Please log in.");
        return;
      }

      try {
        const data = await getChemicals(token);
        const chemicalData = data.map((chemical: { id: number; chemicalName: string }) => ({
          id: chemical.id,
          name: chemical.chemicalName,
        }));
        setChemicals(chemicalData);
      } catch (error) {
        console.error("Error fetching chemicals:", error);
      }
    };

    fetchChemicals();
  }, [token]);

  useEffect(() => {
    const fetchSteps = async () => {
      if (!token) {
        console.error("No authentication token found. Please log in.");
        return;
      }

      try {
        const data = await getSteps(token);
        const stepsData = data.map((step: { id: number; stepName: string }) => ({
          id: step.id,
          title: step.stepName,
          items: [],
          confirmed: false,
        }));
        setSteps(stepsData);
      } catch (error) {
        console.error("Error fetching steps:", error);
      }
    };

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

  const handleAddChemicalClick = () => {
    navigate("/flow/add-chemicals");
  };

  const prediction = () => {
    navigate("/flow/prediction");
  };

  const handleAddStep = () => {
    navigate("/flow/add-step");
  };

  const handleAddTestClick = () => {
    navigate("add-test");
  };

  const handleEditStep = () => {
    setIsEditing((prev) => !prev);
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 2,
          background: "#F1F2F7",
          minHeight: "100vh",
        }}
      >
        <Grid container spacing={2}>
          {/* Left Section */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                padding: 2,
                marginBottom: 2,
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Readings
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => navigate("/user/flow/add-test")}
                  style={{
                    backgroundColor: "#102D4D",
                    color: "white",
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                  }}
                >
                  <Tooltip title="Add Reading" arrow>
                    <FaPlus />
                  </Tooltip>
                </IconButton>
              </div>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {tests.map((test) => (
                  <li
                    key={test.id}
                    style={{
                      backgroundColor: "#F3FAFD",
                      padding: "7px",
                      borderRadius: "5px",
                      marginBottom: "8px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <DraggableItem
                      key={test.id}
                      name={test.name}
                      type={ItemType.TEST}
                      id={test.id}
                    />
                  </li>
                ))}
              </ul>
            </Paper>

            <Paper sx={{ padding: 2, maxHeight: "300px", overflowY: "auto" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Chemicals
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => navigate("/user/flow/add-chemical")}
                  style={{
                    backgroundColor: "#102D4D",
                    color: "white",
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                  }}
                >
                  <Tooltip title="Add Chemical" arrow>
                    <FaPlus />
                  </Tooltip>
                </IconButton>
              </div>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {chemicals.map((chemical) => (
                  <li
                    key={chemical.id}
                    style={{
                      backgroundColor: "#DFF5FF",
                      padding: "7px",
                      borderRadius: "5px",
                      marginBottom: "8px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <DraggableItem
                      key={chemical.id}
                      name={chemical.name}
                      type={ItemType.CHEMICAL}
                      id={chemical.id}
                    />
                  </li>
                ))}
              </ul>
            </Paper>
          </Grid>

          {/* Right Section */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ padding: 2, height: "96%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5" sx={{ flex: 1 }}>
                  Stages
                </Typography>
                <div style={{ display: "flex", gap: "10px" }}>
                  <IconButton
                    size="small"
                    onClick={() => navigate("/user/flow/prediction")}
                    style={{
                      backgroundColor: "#102D4D",
                      color: "white",
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                    }}
                  >
                    <Tooltip title="Predict Values" arrow>
                      <FaChartArea />
                    </Tooltip>
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => navigate("/user/flow/add-step")}
                    style={{
                      backgroundColor: "#102D4D",
                      color: "white",
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                    }}
                  >
                    <Tooltip title="Add Stage" arrow>
                      <FaPlus />
                    </Tooltip>
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handleEditStep}
                    style={{
                      backgroundColor: isEditing ? "#4072AF" : "#102D4D",
                      color: "white",
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                    }}
                  >
                    <Tooltip title="Change Stage Order" arrow>
                      <FaEdit />
                    </Tooltip>
                  </IconButton>
                </div>
              </div>

              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                {steps.map((step, index) => (
                  <Grid item sm={6} md={4} key={step.id}>
                    <DraggableStep
                      step={step}
                      index={index}
                      moveStep={moveStep}
                      onDropItem={handleDropItem}
                      onRemoveItem={handleRemoveItem}
                      isEditing={isEditing}
                      setSteps={setSteps}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </DndProvider>
  );
};

export default FlowCustomizationDashboard;