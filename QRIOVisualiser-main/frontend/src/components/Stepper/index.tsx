import React, { useState, useRef, useEffect } from "react";
import { StepConfig } from "../../types/Steps";
import "../../styles/components/Stepper/steps.css";

type TProps = {
  steps: StepConfig[];
  currentStep: number;
};

function Stepper({ steps, currentStep }: TProps) {
  const isComplete = currentStep - 1 >= steps.length;
  const [margins, setMargins] = useState({
    marginLeft: 0,
    marginRight: 0,
  });
  const stepRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    setMargins({
      marginLeft: stepRef.current[0].offsetWidth / 2,
      marginRight: stepRef.current[steps.length - 1].offsetWidth / 2,
    });
  }, [stepRef, steps.length]);

  if (!steps.length) {
    return <></>;
  }

  const calculateProgressBarWidth = () => {
    return ((currentStep - 1) / (steps.length - 1)) * 100;
  };

  return (
    <>
      <div className="stepper">
        {steps.map((step, index) => {
          return (
            <div
              key={step.stepNumber}
              ref={(el) => (stepRef.current[index] = el as HTMLDivElement)}
              className={`step ${
                currentStep > index + 1 || isComplete ? "complete" : ""
              } ${currentStep === index + 1 ? "active" : ""} `}
            >
              <div className="step-number">
                {currentStep > index + 1 || isComplete ? (
                  <span>&#10003;</span>
                ) : (
                  index + 1
                )}
              </div>
              <div
                className="step-name"
                style={
                  currentStep === step.stepNumber
                    ? { fontFamily: "Poppins-Bold" }
                    : {}
                }
              >
                {step.stepName}
              </div>
            </div>
          );
        })}

        <div
          className="progress-bar"
          style={{
            width: `calc(100% - ${margins.marginLeft + margins.marginRight}px)`,
            marginLeft: margins.marginLeft,
            marginRight: margins.marginRight,
          }}
        >
          <div
            className="progress"
            style={{ width: `${calculateProgressBarWidth()}%` }}
          ></div>
        </div>
      </div>

      {steps[currentStep - 1].component()}
    </>
  );
}

export default React.memo(Stepper);
