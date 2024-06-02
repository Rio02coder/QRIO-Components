import React, { useEffect, useState } from "react";
import { BASE_URL, socket } from "../backend/server";
import { Endpoints, events } from "../backend/urls";
import "../styles/components/LogInfoStyles.css";
import { Socket } from "socket.io-client";
import DefaultEventsMap from "socket.io-client";
import axios from "axios";

type TProps = {
  jobName: string;
};

const LogInfo = (props: TProps) => {
  const [logInfo, setLogInfo] = useState("");

  const handleDisconnect = () => {
    // if (logSocket) {
    //   logSocket.disconnect();
    //   setLogInfo("Socket connection has been disconnected");
    //   setLogSocket(null);
    // }
    axios
      .get(BASE_URL + Endpoints["Cluster Info"], {
        params: {
          jobName: props.jobName,
        },
      })
      .then((value) => setLogInfo(value.data));
  };

  return (
    <div className="centered-text">
      <div className="disconnect-button-container"></div>
      <h2>Log Information:</h2>
      {logInfo === "" ? <></> : <pre>{logInfo}</pre>}
      <button className="disconnect-button" onClick={handleDisconnect}>
        Check Logs
      </button>
    </div>
  );
};

export default LogInfo;
