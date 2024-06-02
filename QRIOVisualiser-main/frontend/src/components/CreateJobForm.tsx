import React, { ChangeEvent, useContext } from "react";
import { JobContext } from "../types/JobContext";
import "../styles/components/JobForm/Form.css";
import { Slider } from "@mui/material";

const CreateJobForm: React.FC = () => {
  const jobContext = useContext(JobContext);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target;
    const processedValue = type === "number" ? parseInt(value) : value;
    jobContext?.setJobData({ [name]: processedValue });
    if (
      jobContext?.errorMap.get(
        name as "jobName" | "imageName" | "qubits" | "cpu" | "memory"
      )
    ) {
      jobContext.removeError(
        name as "jobName" | "imageName" | "qubits" | "cpu" | "memory"
      );
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
        {jobContext?.errorMap.get("jobName") && (
          <p className="error">{jobContext?.errorMap.get("jobName")}</p>
        )}
        <div className="formInput">
          <input
            type="text"
            id="jobName"
            name="jobName"
            value={jobContext?.jobName}
            onChange={handleInputChange}
            required={true}
            // style={{
            //   borderColor: jobContext?.errorMap.get("jobName") && "red",
            // }}
          />
          <label
            htmlFor="jobName"
            style={jobContext?.errorMap.get("jobName") ? { color: "red" } : {}}
          >
            Job Name
          </label>
        </div>

        {jobContext?.errorMap.get("imageName") && (
          <p className="error">{jobContext?.errorMap.get("imageName")}</p>
        )}
        <div className="formInput">
          <input
            type="text"
            id="imageName"
            name="imageName"
            value={jobContext?.imageName}
            onChange={handleInputChange}
            required={true}
            style={
              jobContext?.errorMap.get("imageName")
                ? { borderColor: "red" }
                : {}
            }
          />
          <label
            htmlFor="imageName"
            style={
              jobContext?.errorMap.get("imageName") ? { color: "red" } : {}
            }
          >
            Image Name
          </label>
        </div>

        {jobContext?.errorMap.get("qubits") && (
          <p className="error">{jobContext?.errorMap.get("qubits")}</p>
        )}
        <div className="formInput">
          <input
            type="number"
            min={0}
            max={100}
            id="qubits"
            name="qubits"
            value={jobContext?.qubits}
            onChange={handleInputChange}
            style={
              jobContext?.errorMap.get("qubits") ? { borderColor: "red" } : {}
            }
          />
          <label
            htmlFor="qubits"
            style={jobContext?.errorMap.get("qubits") ? { color: "red" } : {}}
          >
            Qubits
          </label>
        </div>

        {jobContext?.errorMap.get("cpu") && (
          <p className="error">{jobContext?.errorMap.get("cpu")}</p>
        )}
        <div className="formInput">
          <input
            type="number"
            min={0}
            id="CPU"
            name="CPU"
            value={jobContext?.cpu}
            onChange={handleInputChange}
            style={
              jobContext?.errorMap.get("cpu") ? { borderColor: "red" } : {}
            }
          />
          <label
            htmlFor="CPU"
            style={jobContext?.errorMap.get("cpu") ? { color: "red" } : {}}
          >
            CPU
          </label>
        </div>

        {jobContext?.errorMap.get("cpu") && (
          <p className="error">{jobContext?.errorMap.get("cpu")}</p>
        )}
        <div className="formInput">
          <input
            type="number"
            min={0}
            id="memory"
            name="memory"
            value={jobContext?.memory}
            onChange={handleInputChange}
            style={
              jobContext?.errorMap.get("memory") ? { borderColor: "red" } : {}
            }
          />
          <label
            htmlFor="memory"
            style={jobContext?.errorMap.get("memory") ? { color: "red" } : {}}
          >
            Memory
          </label>
        </div>
      </div>
      <img
        src={require("../logos/20943847.jpg")}
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

export default CreateJobForm;
