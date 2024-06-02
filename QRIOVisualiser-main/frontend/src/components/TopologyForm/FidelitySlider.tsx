import { Slider } from "@mui/material";
import React, { useContext } from "react";
import { JobContext } from "../../types/JobContext";

const FidelitySlider = () => {
  const jobContext = useContext(JobContext);

  return (
    <>
      <div style={{ fontFamily: "Poppins-Bold", fontSize: "150%" }}>
        Set Fidelity
      </div>
      <Slider
        min={0}
        max={1}
        style={{ height: "30%", marginTop: "7%", marginBottom: "7%" }}
        marks
        step={0.1}
        valueLabelDisplay="auto"
        onChange={(ev, val) => {
          jobContext?.setJobData({ fidelity: val as number });
        }}
        value={jobContext?.fidelity}
      />
    </>
  );
};

export default React.memo(FidelitySlider);
