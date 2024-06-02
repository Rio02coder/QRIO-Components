import React, { ChangeEvent, useContext } from "react";
import { JobContext, JobContextType } from "../../types/JobContext";
import "../../styles/components/JobForm/ErrorForm/Form.css";
import { Slider } from "@mui/material";
import { unitConverter } from "../../utils/UnitConverter/UnitConverter";
import { JOB_CONFIG } from "../../utils/Consts";
import { UNIT_NAMES } from "../../utils/Units/UnitMap";

const ErrorForm: React.FC = () => {
  const jobContext = useContext(JobContext);
  // const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   const { name, value, type } = event.target;
  //   const processedValue = type === "number" ? parseFloat(value) : value;
  //   jobContext?.setJobData({ [name]: processedValue });
  // };

  const handleUnitChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (jobContext) {
      const unitToChange = name.substring(0, name.indexOf("Unit"));
      const previousUnit = jobContext[name as keyof JobContextType];
      const previousVal = jobContext[unitToChange as keyof JobContextType];
      const previousMin =
        jobContext[(unitToChange + "_min") as keyof JobContextType];
      const previousMax =
        jobContext[(unitToChange + "_max") as keyof JobContextType];
      const newVal = unitConverter(
        previousVal as number,
        previousUnit as UNIT_NAMES,
        value as UNIT_NAMES
      );
      const newMin = unitConverter(
        previousMin as number,
        previousUnit as UNIT_NAMES,
        value as UNIT_NAMES
      );
      const newMax = unitConverter(
        previousMax as number,
        previousUnit as UNIT_NAMES,
        value as UNIT_NAMES
      );
      console.log(newMin, newMax, newVal, unitToChange);
      jobContext?.setJobData({
        [name]: value,
        // [unitToChange]: newVal,
        // [unitToChange + "_min"]: newMin,
        // [unitToChange + "_max"]: newMax,
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          width: "80%",
          borderRadius: "20px",
          marginTop: "3%",
        }}
      >
        {jobContext?.errorMap.get("T1") && (
          <p className="error">{jobContext?.errorMap.get("T1")}</p>
        )}
        <div className="input">
          {/* <input
            type="number"
            step="0.1"
            min="0.0"
            max="10.0"
            id="T1"
            name="T1"
            value={jobContext?.T1}
            onChange={handleInputChange}
            required={true}
            style={jobContext?.errorMap.get("T1") ? { borderColor: "red" } : {}}
          />
          <select
            name="T1Unit"
            value={jobContext?.T1Unit}
            onChange={handleUnitChange}
          >
            <option value={"ms"}>ms</option>
            <option value={"s"}>s</option>
            <option value={"μ"}>μ</option>
          </select> */}
          <Slider
            name="T1"
            min={jobContext ? jobContext.T1_min : 0.0}
            max={jobContext ? jobContext.T1_max : 1.0}
            style={{ height: "30%", alignSelf: "center" }}
            marks
            step={0.000001}
            valueLabelDisplay="auto"
            onChange={(ev, val) => {
              jobContext?.setJobData({ T1: val as number });
            }}
            value={jobContext ? jobContext.T1 : 0.0}
          />
          <select
            name="T1Unit"
            value={jobContext?.T1Unit}
            onChange={handleUnitChange}
            disabled={true}
            style={{ borderColor: "black", color: "black" }}
          >
            <option value={"ms"}>ms</option>
            <option value={"s"}>s</option>
            <option value={"μ"}>μ</option>
          </select>
          <label
            htmlFor="T1"
            style={jobContext?.errorMap.get("T1") ? { color: "red" } : {}}
          >
            T1
          </label>
        </div>

        {jobContext?.errorMap.get("T2") && (
          <p className="error">{jobContext?.errorMap.get("T2")}</p>
        )}
        <div className="input">
          <Slider
            name="T2"
            min={jobContext ? jobContext.T2_min : 0.0}
            max={jobContext ? jobContext.T2_max : 1.0}
            style={{ height: "30%", alignSelf: "center" }}
            marks
            step={0.000001}
            valueLabelDisplay="auto"
            onChange={(ev, val) => {
              jobContext?.setJobData({ T2: val as number });
            }}
            value={jobContext ? jobContext.T2 : 0.0}
          />
          <select
            name="T2Unit"
            value={jobContext?.T2Unit}
            onChange={handleUnitChange}
            disabled={true}
            style={{ borderColor: "black", color: "black" }}
          >
            <option value={"ms"}>ms</option>
            <option value={"s"}>s</option>
            <option value={"μ"}>μ</option>
          </select>
          <label
            htmlFor="T2"
            style={jobContext?.errorMap.get("T2") ? { color: "red" } : {}}
          >
            T2
          </label>
        </div>

        {jobContext?.errorMap.get("errorRate") && (
          <p className="error">{jobContext?.errorMap.get("errorRate")}</p>
        )}
        <div className="input">
          <Slider
            name="Error Rate"
            min={JOB_CONFIG.ERROR_RATE_MIN}
            max={JOB_CONFIG.ERROR_RATE_MAX}
            style={{ height: "30%", alignSelf: "center" }}
            marks
            step={0.0001}
            valueLabelDisplay="auto"
            onChange={(ev, val) => {
              jobContext?.setJobData({ errorRate: val as number });
            }}
            value={jobContext?.errorRate}
          />
          <select
            name="errorRateUnit"
            value={"%"}
            onChange={handleUnitChange}
            disabled={true}
            style={{ borderColor: "black", color: "black" }}
          >
            <option value={"%"}>%</option>
          </select>
          <label
            htmlFor="Error Rate"
            style={
              jobContext?.errorMap.get("errorRate") ? { color: "red" } : {}
            }
          >
            Error Rate
          </label>
        </div>

        {jobContext?.errorMap.get("readout") && (
          <p className="error">{jobContext?.errorMap.get("readout")}</p>
        )}
        <div className="input">
          <Slider
            name="readout"
            min={JOB_CONFIG.READOUT_MIN}
            max={JOB_CONFIG.READOUT_MAX}
            style={{ height: "30%", alignSelf: "center" }}
            marks
            step={0.0001}
            valueLabelDisplay="auto"
            onChange={(ev, val) => {
              jobContext?.setJobData({ readout: val as number });
            }}
            value={jobContext?.readout}
          />
          <select
            name="readoutUnit"
            value={"%"}
            onChange={handleUnitChange}
            disabled={true}
            style={{ borderColor: "black", color: "black" }}
          >
            <option value={"%"}>%</option>
          </select>
          <label
            htmlFor="readout"
            style={jobContext?.errorMap.get("readout") ? { color: "red" } : {}}
          >
            readout
          </label>
        </div>
      </div>
      <img
        src={require("../../logos/20943847.jpg")}
        alt="Logo"
        style={{
          maxWidth: "40%",
          maxHeight: "80%",
          alignSelf: "center",
        }}
      />
    </div>
  );
};

export default ErrorForm;
