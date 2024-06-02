import React from "react";

type TProps = {
  deviceName: string;
  kubeNodeName: string;
};

const QuantumNodeImage = ({ deviceName, kubeNodeName }: TProps) => {
  const imageFileSrc = require(`../../DeviceImages/${deviceName}.jpg`);
  return (
    <div style={{ width: "100%", height: "100%", overflow: "scroll" }}>
      <img
        src={imageFileSrc}
        alt="Device Topology"
        style={{
          width: "60%",
          maxWidth: "100%",
          height: "70%",
          marginTop: "4%",
        }}
      />
      <div
        style={{
          textOverflow: "ellipsis",
          textAlign: "center",
          fontFamily: "Poppins-Regular",
        }}
      >{`${deviceName} - ${kubeNodeName}`}</div>
    </div>
  );
};

export default React.memo(QuantumNodeImage);
