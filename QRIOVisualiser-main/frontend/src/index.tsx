import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { JobContext, JobContextType } from "./types/JobContext";
import { JOB_CONFIG } from "./utils/Consts";

const Root = () => {
  const getMapWithFieldDeleted = (
    errorMap: Map<
      keyof Omit<
        Omit<
          Omit<
            Omit<Omit<JobContextType, "errorMap">, "setJobData">,
            "setError"
          >,
          "clearError"
        >,
        "removeError"
      >,
      string
    >,
    field: keyof Omit<
      Omit<
        Omit<Omit<Omit<JobContextType, "errorMap">, "setJobData">, "setError">,
        "clearError"
      >,
      "removeError"
    >
  ) => {
    let newMap = new Map(errorMap);
    newMap.delete(field);
    console.log("New Map", newMap);
    return newMap;
  };

  const [jobData, setJobData] = useState<JobContextType>({
    circuitFile: null,
    topologyFile: null,
    qubits: 0,
    cpu: 0,
    memory: 0,
    jobName: "",
    imageName: "",
    errorRate: JOB_CONFIG.errorRate,
    readout: JOB_CONFIG.readout,
    T1: JOB_CONFIG.T1,
    T2: JOB_CONFIG.T2,
    T1Unit: "μ",
    T2Unit: "μ",
    T1_min: JOB_CONFIG.T1_MIN,
    T1_max: JOB_CONFIG.T1_MAX,
    T2_min: JOB_CONFIG.T2_MIN,
    T2_max: JOB_CONFIG.T2_MAX,
    fidelity: undefined,
    errorMap: new Map([]),
    setJobData: (data) => {
      setJobData((prevJobData) => ({
        ...prevJobData,
        ...data,
      }));
    },
    setError: (field, message) => {
      setJobData((prevJobData) => ({
        ...prevJobData,
        errorMap: new Map(prevJobData.errorMap).set(field, message),
      }));
    },
    clearError: () => {
      setJobData((prevJobData) => ({
        ...prevJobData,
        errorMap: new Map([]),
      }));
    },
    removeError: (field) => {
      setJobData((prevJobData) => ({
        ...prevJobData,
        errorMap: getMapWithFieldDeleted(prevJobData.errorMap, field),
      }));
    },
  });

  return (
    <JobContext.Provider value={jobData}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </JobContext.Provider>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<Root />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
