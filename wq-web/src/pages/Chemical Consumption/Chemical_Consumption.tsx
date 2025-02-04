import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChemicalConsumption: React.FC = () => {
  const [formData, setFormData] = useState({
    water_volume: "",
    initial_cholrine: "",
    initial_ph: "",
    initial_turbidity: "",
  });

  const [prediction, setPrediction] = useState<{ [key: string]: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get today's date and day
  const today = new Date();
  const todayDate = today.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const todayDay = today.toLocaleDateString("en-US", { weekday: "long" });

  const pastData = [
    { day: "Day -3", chlorine: 3.0, carbonate: 2.0, pac: 4.2 },
    { day: "Day -2", chlorine: 3.2, carbonate: 2.1, pac: 4.5 },
    { day: "Day -1", chlorine: 3.3, carbonate: 2.2, pac: 4.6 },
  ];

  const futureData = [
    { day: "Day +1", chlorine: 3.7, carbonate: 2.3, pac: 4.9 },
    { day: "Day +2", chlorine: 3.8, carbonate: 2.4, pac: 5.0 },
    { day: "Day +3", chlorine: 4.0, carbonate: 2.5, pac: 5.2 },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch("http://localhost:8080/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          water_volume: parseFloat(formData.water_volume),
          initial_cholrine: parseFloat(formData.initial_cholrine),
          initial_ph: parseFloat(formData.initial_ph),
          initial_turbidity: parseFloat(formData.initial_turbidity),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch prediction");
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    }
  };

  // Prepare data for charts
  const labels = [...pastData.map(d => d.day), "Today", ...futureData.map(d => d.day)];

  const createChartData = (dataKey: string, color: string) => {
    const data = [
      ...pastData.map(d => d[dataKey as keyof typeof pastData[0]] as number),
      prediction ? prediction[dataKey] : null,
      ...futureData.map(d => d[dataKey as keyof typeof futureData[0]] as number),
    ];

    return {
      labels,
      datasets: [
        {
          label: `${dataKey} Consumption`,
          data,
          borderColor: color,
          backgroundColor: `${color}33`,
          borderWidth: 2,
          pointRadius: 5,
          tension: 0.3,
        },
      ],
    };
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", textAlign: "center" }}>
      <h2 style={{ color: "#007BFF", marginBottom: "20px" }}>Chemical Consumption Prediction</h2>

      {/* Stylish Card for Today's Date */}
      <div style={{
        background: "linear-gradient(135deg, #4CAF50, #2E7D32)",
        padding: "15px",
        borderRadius: "12px",
        color: "white",
        textAlign: "center",
        width: "300px",
        margin: "auto",
        boxShadow: "3px 3px 15px rgba(0, 0, 0, 0.2)"
      }}>
        <h3 style={{ margin: 0 }}>{todayDay}</h3>
        <p style={{ margin: 0, fontSize: "18px" }}>{todayDate}</p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <input type="number" name="water_volume" placeholder="Water Volume (L)" value={formData.water_volume} onChange={handleChange} required style={inputStyle} />
        <input type="number" name="initial_cholrine" placeholder="Initial Chlorine (mg/L)" value={formData.initial_cholrine} onChange={handleChange} required style={inputStyle} />
        <input type="number" step="0.1" name="initial_ph" placeholder="Initial pH" value={formData.initial_ph} onChange={handleChange} required style={inputStyle} />
        <input type="number" name="initial_turbidity" placeholder="Initial Turbidity (NTU)" value={formData.initial_turbidity} onChange={handleChange} required style={inputStyle} />
        <button type="submit" style={buttonStyle}>Predict</button>
      </form>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {prediction && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <h3 style={{ color: "#007BFF" }}>Prediction Results:</h3>
          <p><strong>Applied Chlorine (KG):</strong> {prediction["Applied Chlorine (KG)"]}</p>
          <p><strong>Applied Calcium Carbonate (KG):</strong> {prediction["Applied Calcium Carbonate (KG)"]}</p>
          <p><strong>Applied PAC (KG):</strong> {prediction["Applied PAC (KG)"]}</p>
        </div>
      )}

      {/* Charts */}
      {prediction && (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
          <ChartCard title="Chlorine Consumption" data={createChartData("Applied Chlorine (KG)", "red")} />
          <ChartCard title="Calcium Carbonate Consumption" data={createChartData("Applied Calcium Carbonate (KG)", "blue")} />
          <ChartCard title="PAC Consumption" data={createChartData("Applied PAC (KG)", "green")} />
        </div>
      )}
    </div>
  );
};

// Chart Card Component
const ChartCard = ({ title, data }: { title: string; data: any }) => (
  <div style={{ width: "600px", background: "white", padding: "15px", borderRadius: "10px", boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)" }}>
    <h3>{title}</h3>
    <Line data={data} options={{ responsive: true, plugins: { legend: { display: true } } }} />
  </div>
);

// Styles
const inputStyle = { margin: "8px", padding: "10px", width: "250px", borderRadius: "8px", border: "1px solid #ccc" };
const buttonStyle = { marginTop: "10px", padding: "10px 20px", background: "#007BFF", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" };

export default ChemicalConsumption;
