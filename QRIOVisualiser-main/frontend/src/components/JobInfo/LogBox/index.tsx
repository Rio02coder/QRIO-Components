import { AxiosResponse } from "axios";
import React, { useState } from "react";
import LogChecker from "./LogChecker";
import styles from "../../../styles/components/JobInfo/LogBox/index";
import LogStyles from "../../../styles/components/JobInfo/LogBox/LogText";

type TProps = {
  setDevice: (device: string) => void;
};

const LogBox = ({ setDevice }: TProps) => {
  const [logMessage, setLogMessage] = useState<string>("");

  const manageDevice = (response: AxiosResponse<any, any>) => {
    if (response.status < 400 && response.data.device !== "") {
      setDevice(response.data.device);
    } else {
      alert(
        "Device has not been found for the job. It is in the process of being allocated"
      );
    }
  };

  const manageLogs = (response: AxiosResponse<any, any>) => {
    console.log(response.data);
    if (!response.data.log || response.data.log === "") {
      console.log("Here");
      alert(
        "Logs are not yet found for the job. It is possible that the job is still running or there are no logs for your job"
      );
    } else {
      setLogMessage(response.data.log);
    }
  };

  const manageResponse = (response: AxiosResponse<any, any>) => {
    manageLogs(response);
    manageDevice(response);
  };

  return (
    <div style={styles}>
      {logMessage !== "" && <div style={LogStyles}>{logMessage}</div>}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LogChecker onLogRetrieval={manageResponse} />
      </div>
    </div>
  );
};

export default React.memo(LogBox);
