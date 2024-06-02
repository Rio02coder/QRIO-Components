import { AxiosResponse } from "axios";
import React, { useState } from "react";
import LogChecker from "./LogChecker";
import styles from "../../../styles/components/JobInfo/LogBox/index";
import LogStyles from "../../../styles/components/JobInfo/LogBox/LogText";

type TProps = {
  setDevice: (device: string) => void;
};

const LogBox = ({ setDevice }: TProps) => {
  const [showLogButton, setShowLogButton] = useState<boolean>(true);
  const [logMessage, setLogMessage] = useState<string>("");

  const manageDevice = (response: AxiosResponse<any, any>) => {
    if (response.status < 400 && response.data.device) {
      setDevice(response.data.device);
    }
  };

  const manageLogs = (response: AxiosResponse<any, any>) => {
    if (response.status === 400 || response.data.message) {
      setShowLogButton(true);
    } else {
      setShowLogButton(false);
      setLogMessage(response.data.log);
    }
  };

  const manageResponse = (response: AxiosResponse<any, any>) => {
    manageLogs(response);
    manageDevice(response);
  };

  return (
    <div style={styles}>
      {showLogButton && <LogChecker onLogRetrieval={manageResponse} />}
      {logMessage !== "" && <div style={LogStyles}>{logMessage}</div>}
    </div>
  );
};

export default React.memo(LogBox);
