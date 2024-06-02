export type StepConfig = {
  stepNumber: number;
  component: () => React.ReactNode;
  stepName: string;
};
