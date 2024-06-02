import { FormEvent } from "react";
import { StepConfig } from "../types/Steps";
import { JobContextType } from "../types/JobContext";
import CreateJobForm from "../components/CreateJobForm";
import TopologyForm from "../components/TopologyForm";
import ErrorForm from "../components/ErrorForm";

export type formEvent = {
  event: FormEvent;
  args: Partial<JobContextType>;
};
export type formStepConfigType = undefined | formEvent;

export const formSteps: StepConfig[] = [
  {
    stepNumber: 1,
    component: () => {
      return <></>;
    },
    stepName: "Choose Circuit",
  },
  {
    stepNumber: 2,
    component: () => {
      return <CreateJobForm />;
    },
    stepName: "Configure Job",
  },
  {
    stepNumber: 3,
    component: () => {
      return <ErrorForm />;
    },
    stepName: "Configure Error",
  },
  {
    stepNumber: 4,
    component: () => {
      return <TopologyForm />;
    },
    stepName: "Choose Topology",
  },
];
