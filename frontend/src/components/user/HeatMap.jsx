import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";

const generateActivityData = () => {
  const data = [];
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 5);

  let currentDate = new Date(start);
  while (currentDate <= end) {
    // Generate realistic contribution levels (0 to 4)
    const count = Math.random() > 0.4 ? Math.floor(Math.random() * 5) : 0;
    data.push({
      date: currentDate.toISOString().split("T")[0],
      count: count,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return { data, start, end };
};

const HeatMapProfile = () => {
  const [activityData, setActivityData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    const { data, start } = generateActivityData();
    setActivityData(data);
    setStartDate(start);
  }, []);

  const totalContributions = activityData.reduce((acc, curr) => acc + (curr.count > 0 ? curr.count : 0), 0);

  return (
    <div className="heatmap-container">
      <div className="heatmap-header">
        <h4>{totalContributions} contributions in the last 5 months</h4>
      </div>
      <div className="heatmap-scroll">
        <HeatMap
          className="HeatMapProfile"
          style={{ color: "#c9d1d9", width: "100%" }}
          value={activityData}
          weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
          startDate={startDate}
          rectSize={14}
          space={3}
          rectProps={{
            rx: 3,
          }}
          panelColors={{
            0: "#161b22",
            1: "#0e4429",
            2: "#006d32",
            3: "#26a641",
            4: "#39d353",
          }}
        />
      </div>
    </div>
  );
};

export default HeatMapProfile;