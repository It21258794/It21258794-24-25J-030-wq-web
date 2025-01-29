import React, { useState, useEffect } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import { Box, Grid, Typography, Paper, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getTests, getChemicals, getSteps, updateStepOrder } from "../../server/flow-customisation/flow-customisationAPI"; // Import the API function

enum ItemType {
  CHEMICAL = "chemical",
  TEST = "test",
  STEP = "step",
}

interface StepItem {
  id: number;
  title: string;
  items: string[];
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
    drop: (item: { name: string; type: ItemType }) =>
      onDropItem(step.id, item.name, item.type),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const navigate = useNavigate();

  const handleStepClick = () => {
    navigate(`/flow/step/${step.id}`);
  };

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
      <Typography variant="h6" onClick={handleStepClick} style={{ cursor: "pointer" }}>
        {step.title}
      </Typography>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {(step.items || []).map((item, index) => (
          <li
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "5px 0",
            }}
          >
            {item}
            <IconButton
              size="small"
              onClick={() => onRemoveItem(step.id, item)}
              style={{ color: "#4072AF" }}
            >
              <FaTrash />
            </IconButton>
          </li>
        ))}
      </ul>
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
      prevSteps.map((step) =>
        step.id === stepId
          ? { ...step, items: [...new Set([...step.items, itemName])] }
          : step
      )
    );
  };

  const handleRemoveItem = (stepId: number, itemName: string) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === stepId
          ? { ...step, items: step.items.filter((item) => item !== itemName) }
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
                      isEditing={isEditing}
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
