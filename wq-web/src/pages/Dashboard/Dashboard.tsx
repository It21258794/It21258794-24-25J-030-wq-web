import { WaterDrop, AcUnit, DeviceHub } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Grid2,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { LineChart } from "@mui/x-charts";
import React from "react";

const Dashboard = (): JSX.Element => {
  const [alignment, setAlignment] = React.useState("web");
  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
  };

  return (
    <>
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "0.875rem",
        }}
      >
        <ToggleButton
          value="rawWater"
          sx={{
            fontSize: "0.6rem",
            textAlign: "center",
            fontWeight: 800,
          }}
        >
          Raw Water
        </ToggleButton>
        <ToggleButton
          value="treatedWater"
          sx={{
            fontSize: "0.6rem",
            textAlign: "center",
            fontWeight: 800,
          }}
        >
          Treated Water
        </ToggleButton>
      </ToggleButtonGroup>
      <Grid2
        container
        spacing={2}
        justifyContent="center"
        sx={{ marginTop: "20px" }}
      >
        <Card
          sx={{
            textAlign: "center",
            padding: 2,
            borderRadius: 2,
            boxShadow: 3,
            width: "30%",
          }}
        >
          <CardContent>
            <WaterDrop sx={{ fontSize: 20, color: "teal" }} />
            <Typography
              variant="h5"
              sx={{ fontSize: 15, fontWeight: "bold", marginTop: 1 }}
            >
              Turbidity
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontSize: 24, fontWeight: "bold", marginTop: 1 }}
            >
              11.15
            </Typography>
            <Typography sx={{ fontSize: 10, marginTop: 1, color: "gray" }}>
              Last Updated: 4 days ago
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            textAlign: "center",
            padding: 2,
            borderRadius: 2,
            boxShadow: 3,
            width: "30%",
          }}
        >
          <CardContent>
            <AcUnit sx={{ fontSize: 20, color: "teal" }} />
            <Typography
              variant="h5"
              sx={{ fontSize: 15, fontWeight: "bold", marginTop: 1 }}
            >
              pH
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontSize: 24, fontWeight: "bold", marginTop: 1 }}
            >
              7.12
            </Typography>
            <Typography sx={{ fontSize: 10, marginTop: 1, color: "gray" }}>
              Last Updated: 4 days ago
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            textAlign: "center",
            padding: 2,
            borderRadius: 2,
            boxShadow: 3,
            width: "30%",
          }}
        >
          <CardContent>
            <DeviceHub sx={{ fontSize: 20, color: "teal" }} />
            <Typography
              variant="h5"
              sx={{ fontSize: 15, fontWeight: "bold", marginTop: 1 }}
            >
              Conductivity
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontSize: 24, fontWeight: "bold", marginTop: 1 }}
            >
              34.54
            </Typography>
            <Typography sx={{ fontSize: 10, marginTop: 1, color: "gray" }}>
              Last Updated: 4 days ago
            </Typography>
          </CardContent>
        </Card>
      </Grid2>
      <Grid2
        container
        spacing={10}
        justifyContent="center"
        sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      >
        <Card
          sx={{
            padding: 2,
            borderRadius: 2,
            boxShadow: 3,
            width: "93%",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              fontWeight: 750,
              fontSize: 15,
              marginTop: 1,
              color: "gray",
            }}
          >
            Chart
          </Typography>
          <></>
          <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[
              {
                data: [2, 5.5, 2, 8.5, 1.5, 5],
              },
            ]}
            width={900}
            height={300}
          />
        </Card>
      </Grid2>
      <Grid2
        container
        spacing={10}
        justifyContent="center"
        sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      >
        <Card
          sx={{
            padding: 2,
            borderRadius: 2,
            boxShadow: 3,
            width: "93%",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              fontWeight: 750,
              fontSize: 15,
              marginTop: 1,
              color: "gray",
            }}
          >
            Total Analysis
          </Typography>
          <></>
          <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[
              { color: "green", data: [0, 5, 2, 6, 3, 9.3] },
              { color: "red", data: [6, 3, 7, 9.5, 4, 2] },
              { color: "blue", data: [3, 1, 3, 6, 2, 1] },
            ]}
            width={900}
            height={300}
          />
        </Card>
      </Grid2>
    </>
  );
};

export default Dashboard;
