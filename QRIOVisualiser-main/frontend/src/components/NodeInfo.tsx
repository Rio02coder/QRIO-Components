import React, { useEffect, useState } from "react";
import { BASE_URL, socket } from "../backend/server";
import { Endpoints, events } from "../backend/urls";
import "../styles/components/NodeInfoStyles.css";
import { Socket } from "socket.io-client";
import DefaultEventsMap from "socket.io-client";
// import { useLocation } from "react-router-dom";

type TProps = {
  jobName: string;
};

const NodeInfo = (props: TProps) => {
  const [nodeInfo, setNodeInfo] = useState("");

  const [nodeSocket, setNodeSocket] = useState<Socket<
    typeof DefaultEventsMap,
    typeof DefaultEventsMap
  > | null>(null);

  useEffect(() => {
    // This code runs after the component has been rendered

    // Create a new socket connection when the component mounts
    const newSocket = socket(BASE_URL + Endpoints["Node Info"], {
      transports: ["websocket"],
      upgrade: false,
    });

    newSocket.emit(events["Send Job Info"], props.jobName);

    // Set up a listener for the 'nodeInfo' event from the server
    newSocket.on(events["Node Info"], (data) => {
      setNodeInfo(data.data);
    });

    // Save the socket to the component's state
    setNodeSocket(newSocket);

    // This function will be called when the component is unmounted or the socket is disconnected
    return () => {
      // Disconnect the socket to prevent memory leaks
      if (newSocket) {
        newSocket.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDisconnect = () => {
    if (nodeSocket) {
      nodeSocket.disconnect();
      setNodeInfo("Socket connection has been disconnected");
      setNodeSocket(null);
    }
  };

  return (
    <div className="centered-text">
      <div className="disconnect-button-container">
        <button className="disconnect-button" onClick={handleDisconnect}>
          Disconnect
        </button>
      </div>
      <h2>Node Information:</h2>
      <pre>{nodeInfo}</pre>
    </div>
  );
};

export default NodeInfo;
