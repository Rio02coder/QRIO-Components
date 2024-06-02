import React from "react";
import QuantumNode from "../components/ViewCluster/QuantumNode";
import Header from "../components/ViewCluster/Header";
import { QuantumDevice, quantumDeviceArray } from "../utils/devices";

const Cluster = () => {
  return (
    <div>
      <Header />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {quantumDeviceArray.map((device: QuantumDevice, index) => {
          return (
            <QuantumNode
              key={index}
              kubeNodeName={device.kubeNodeName}
              deviceName={device.deviceName}
            />
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(Cluster);
