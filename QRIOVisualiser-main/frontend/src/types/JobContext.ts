import { createContext } from "react";

export type JobContextType = {
  circuitFile: File | null;
  topologyFile: File | null;
  qubits: number;
  cpu: number;
  memory: number;
  jobName: string;
  errorRate: number;
  readout: number;
  T1: number;
  T2: number;
  T1_min: number;
  T1_max: number;
  T2_min: number;
  T2_max: number;
  T1Unit: "μ" | "ms" | "s";
  T2Unit: "μ" | "ms" | "s";
  imageName: string;
  fidelity?: number;
  removeError: (
    field: keyof Omit<
      Omit<
        Omit<Omit<Omit<JobContextType, "errorMap">, "setJobData">, "setError">,
        "clearError"
      >,
      "removeError"
    >
  ) => void;
  errorMap: Map<
    keyof Omit<
      Omit<
        Omit<Omit<Omit<JobContextType, "errorMap">, "setJobData">, "setError">,
        "clearError"
      >,
      "removeError"
    >,
    string
  >;
  setJobData: (data: Partial<Omit<JobContextType, "errorMap">>) => void;
  setError: (
    field: keyof Omit<
      Omit<
        Omit<Omit<Omit<JobContextType, "errorMap">, "setJobData">, "setError">,
        "clearError"
      >,
      "removeError"
    >,
    message: string
  ) => void;
  clearError: () => void;
};

export const JobContext = createContext<JobContextType | undefined>(undefined);
