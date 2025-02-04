import React, { useState, useEffect } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FaTrash, FaPlus, FaEdit,FaCheck } from "react-icons/fa";
import { Box, Grid, Typography, Paper, IconButton } from "@mui/material";
import { Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getTests, getChemicals, getSteps, updateStepOrder,createStepValue } from "../../server/flow-customisation/flow-customisationAPI"; // Import the API function

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

interface DraggableStepProps {
  step: StepItem;
  index: number;
  moveStep: (fromIndex: number, toIndex: number) => void;
  onDropItem: (stepId: number, itemName: string, itemType: ItemType) => void;
  onRemoveItem: (stepId: number, itemName: string) => void;
  isEditing: boolean;
}

interface DraggableItemProps {
  name: string;
  type: ItemType;
}

const DraggableStep: React.FC<DraggableStepProps> = ({
  step,
  index,
  moveStep,
  onDropItem,
  onRemoveItem,
  isEditing,
}) => {
  const [, dragRef] = useDrag({
    type: ItemType.STEP,
    item: { index },
    canDrag: isEditing, // Enable drag only in edit mode
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
      <Step step={step} onDropItem={onDropItem} onRemoveItem={onRemoveItem} />
    </div>
    
  );
};

interface StepProps {
  step: StepItem;
  onDropItem: (stepId: number, itemName: string, itemType: ItemType) => void;
  onRemoveItem: (stepId: number, itemName: string) => void;
}

const Step: React.FC<StepProps> = ({ step, onDropItem, onRemoveItem }) => {
  const [{ isOver }, dropRef] = useDrop({
    accept: [ItemType.CHEMICAL, ItemType.TEST],
    drop: (item: { name: string; type: ItemType }) => {
      onDropItem(step.id, item.name, item.type);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });
  const [steps, setSteps] = useState<StepItem[]>([]);

  const [tests, setTests] = useState<string[]>([]); // State for backend tests
  const [chemicals, setChemicals] = useState<string[]>([]); // State for backend tests

  const navigate = useNavigate();

  const handleStepClick = () => {
    navigate(`/flow/step/${step.id}`);
  };
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
   const [alertMessage, setAlertMessage] = useState<string>("");
    const [alertSeverity, setAlertSeverity] = useState<"error" | "warning" | "info" | "success">();
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  const handleConfirmClick = async () => {
    setSteps((prevSteps) =>
      prevSteps.map((s) =>
        s.id === step.id ? { ...s, confirmed: true } : s
      )
    );
  
    try {
      for (const item of step.items) {
        const payload = {
          stepId: step.id,
          testId: item.type === ItemType.TEST ? item.id : undefined,
          chemicalId: item.type === ItemType.CHEMICAL ? item.id : undefined,
        };

        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3Mzg2NzIzMjF9.vjnLnEfbo9XVPcVCl65HnexuLF8BoN37Himc34wAEGo";
        await createStepValue(token, payload);
      }
  
      // ✅ Reset the items after successful update
      setSteps((prevSteps) =>
        prevSteps.map((s) =>
          s.id === step.id ? { ...s, confirmed: true } : s
        )
      );
      step.items = []; // ✅ Clear step items
  
      setAlertSeverity("success");
      setAlertMessage("Step confirmed and values updated!");
      setOpenSnackbar(true);
      console.log("Step confirmed and values updated!");
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
  
  
  
  
  
  // Check if the step has any items (i.e., if any values were dropped)
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
        width: 200,
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
          maxHeight: "100px", // Maximum height for the items list
          overflowY: "auto", // Adds vertical scrollbar when content overflows
          marginBottom: "10px", // Optional: adds some space between list and the button
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
              {/* {item.id && (
                <span>
                  ({item.type === ItemType.TEST ? 'Test' : 'Chemical'} ID: {item.id})
                </span>
              )} */}
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



const DraggableItem: React.FC<DraggableItemProps> = ({ name, type }) => {
  const [, dragRef] = useDrag({
    type,
    item: { name, type },
  });

  return (
    <li ref={dragRef} style={{ marginBottom: "10px", cursor: "grab" }}>
      {name}
    </li>
  );
};

const FlowCustomizationDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [steps, setSteps] = useState<StepItem[]>([]);

  const [tests, setTests] = useState<string[]>([]); // State for backend tests
  const [chemicals, setChemicals] = useState<string[]>([]); // State for backend tests

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await getTests();
        const testNames = data.map((test: { testName: string }) => test.testName);
        setTests(testNames);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    fetchTests();
  }, []);

  useEffect(() => {
    const fetchChemicals = async () => {
      try {
        const data = await getChemicals();
        const chemicalName = data.map((chemical: { chemicalName: string }) => chemical.chemicalName);
        setChemicals(chemicalName);
      } catch (error) {
        console.error("Error fetching chemicals:", error);
      }
    };

    fetchChemicals();
  }, []);

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const data = await getSteps();
        const stepsData = data.map((step: { id: number, stepName: string }) => ({
          id: step.id,
          title: step.stepName,  // Ensure you assign stepName to title
          items: [], // You can modify this if you have specific items to assign here
        }));
        setSteps(stepsData);
      } catch (error) {
        console.error("Error fetching steps:", error);
      }
    };

    fetchSteps();
  }, []);

  const handleDropItem = (stepId: number, itemName: string, itemType: ItemType) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) => {
        if (step.id === stepId) {
          // Find the ID based on the item type and name
          let itemId: number | undefined;
          if (itemType === ItemType.TEST) {
            const testIndex = tests.findIndex(test => test === itemName);
            itemId = testIndex !== -1 ? testIndex + 1 : undefined;
          } else if (itemType === ItemType.CHEMICAL) {
            const chemicalIndex = chemicals.findIndex(chemical => chemical === itemName);
            itemId = chemicalIndex !== -1 ? chemicalIndex + 1 : undefined;
          }
  
          // Check if item already exists
          const itemExists = step.items.some(item => 
            item.name === itemName && item.type === itemType
          );
  
          if (!itemExists) {
            return {
              ...step,
              items: [...step.items, { name: itemName, type: itemType, id: itemId }]
            };
          }
        }
        return step;
      })
    );
  };;
  

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

  const handleAddStep = () => {
    navigate("/flow/add-step");
  };
  const handleAddTestClick = () => {
    navigate("/flow/add-test");
  };
  const handleEditStep = () => {
    setIsEditing((prev) => !prev); // Toggle edit mode
  };

  const moveStep = async (fromIndex: number, toIndex: number) => {
    const updatedSteps = [...steps];
    const [removedStep] = updatedSteps.splice(fromIndex, 1);
    updatedSteps.splice(toIndex, 0, removedStep);

    // Update local state
    setSteps(updatedSteps);

    // Prepare the steps data
    const stepsToUpdate = updatedSteps.map((step, index) => ({
      id: step.id,
      stepOrder: index + 1,
    }));

    try {
      await updateStepOrder(stepsToUpdate);
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
        <Typography variant="h4" color="black" gutterBottom>
          Flow Customization
        </Typography>

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
                  Tests
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleAddTestClick}
                  style={{
                    backgroundColor: "#102D4D",
                    color: "white",
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                  }}
                >
                  <FaPlus />
                </IconButton>
              </div>
              <ul style={{ listStyleType: "none", padding: 0 }}
              >                {tests.map((test, index) => (
                <li style={{
                  backgroundColor: "#F3FAFD", // Light blue background
                  padding: "7px",
                  borderRadius: "5px",
                  marginBottom: "8px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow for better visibility
                }}>                  <DraggableItem key={index} name={test} type={ItemType.TEST} />
                </li>
              ))}
              </ul>
            </Paper>

            <Paper sx={{ padding: 2, maxHeight: "300px", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" gutterBottom>
                  Chemicals
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleAddChemicalClick}
                  style={{
                    backgroundColor: "#102D4D",
                    color: "white",
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                  }}
                >
                  <FaPlus />
                </IconButton>
              </div>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {chemicals.map((chemical, index) => (
                  <li
                    key={index}
                    style={{
                      backgroundColor: "#DFF5FF", // Light blue background
                      padding: "7px",
                      borderRadius: "5px",
                      marginBottom: "8px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow for better visibility
                    }}
                  >
                    <DraggableItem name={chemical} type={ItemType.CHEMICAL} />
                  </li>
                ))}
              </ul>
            </Paper>
          </Grid>


          {/* Right Section */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ padding: 2, height: "96%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h5" sx={{ flex: 1 }}>
                  Steps
                </Typography>
                <div style={{ display: "flex", gap: "10px" }}>
                  <IconButton
                    size="small"
                    onClick={handleAddStep}
                    style={{
                      backgroundColor: "#102D4D",
                      color: "white",
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                    }}
                  >
                    <FaPlus />
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
                    <FaEdit />
                  </IconButton>
                </div>
              </div>

              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                {steps.map((step, index) => (
                  <Grid item sm={6} md={4} key={index}>
                    <DraggableStep
                      key={step.id}
                      step={step}
                      index={index}
                      moveStep={moveStep}
                      onDropItem={handleDropItem}
                      onRemoveItem={handleRemoveItem}
                      isEditing={isEditing} // Pass the editing state
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
