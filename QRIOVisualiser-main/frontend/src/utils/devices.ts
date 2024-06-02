export type QuantumDevice = {
  deviceName: string;
  kubeNodeName: string;
};

export const quantumDeviceArray: QuantumDevice[] = [
  { deviceName: "Ibm_Nairobi", kubeNodeName: "qiskube-m02" },
  { deviceName: "Ibm_Nairobi", kubeNodeName: "qiskube-m03" },
  { deviceName: "Ibm_Nairobi", kubeNodeName: "qiskube-m04" },
  { deviceName: "Ibm_Nairobi", kubeNodeName: "qiskube-m05" },
  { deviceName: "Ibm_Nairobi", kubeNodeName: "qiskube-m06" },
  { deviceName: "Ibm_Nairobi", kubeNodeName: "qiskube-m07" },
];
