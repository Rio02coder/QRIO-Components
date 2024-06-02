export type SubmitJobRequestProps = {
  circuitFile: File;
  // topologyFile?: File;
  // fidelity?: number;
  qubits: number;
  cpu: number;
  memory: number;
  jobName: string;
  imageName: string;
  T1: number;
  T2: number;
  errorRate: number;
  readout: number;
  T1Unit: "μ" | "ms" | "s";
  T2Unit: "μ" | "ms" | "s";
};
