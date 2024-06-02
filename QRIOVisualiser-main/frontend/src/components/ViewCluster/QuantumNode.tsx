import React from "react";
import ChooserBox from "../FileUpload/ChooserBox";
import QuantumNodeImage from "./QuantumNodeImage";

type TProps = {
  key?: number;
  deviceName: string;
  kubeNodeName: string;
};

const QuantumNode = ({ key, deviceName, kubeNodeName }: TProps) => {
  return (
    <ChooserBox
      key={key}
      width="50vb"
      borderStyle="solid"
      height="35vh"
      marginLeft="10px"
      marginRight="10px"
      marginBottom="10px"
    >
      <QuantumNodeImage deviceName={deviceName} kubeNodeName={kubeNodeName} />
    </ChooserBox>
  );
};

export default React.memo(QuantumNode);
