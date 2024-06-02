import React, { FormEvent, useContext, useState } from "react";
import { JobContext, JobContextType } from "../types/JobContext";
import { formSteps } from "../utils/FormSteps";
import Stepper from "../components/Stepper";
import "../styles/components/Stepper/button.css";
import { formValidators } from "../utils/FormValidator";
import SubmitJobContactor from "../backend/contactor/SubmitJob";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const jobContext = useContext(JobContext);
  const [currentStep, setCurrentStep] = useState<number>(2);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (!jobContext) {
  //     setIsLoading(true);
  //   } else {
  //     setIsLoading(false);
  //   }
  // }, [jobContext]);

  const handleNext = (e: FormEvent) => {
    e.preventDefault();
    const validator = formValidators.get(formSteps[currentStep - 1].stepName);
    let isFormValid = false;
    if (validator) {
      isFormValid = validator(jobContext as JobContextType);
    }

    if (isFormValid) {
      if (currentStep - 1 < formSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        console.log("Performing network call");
        setIsLoading(true);
        const submitJobContactor: SubmitJobContactor = new SubmitJobContactor(
          jobContext as JobContextType
        );
        submitJobContactor
          .contact()
          .then((res) => {
            navigate("/job-info");
          })
          .catch(() => {
            alert(
              "Our servers are down and we will get back as soon as possible."
            );
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  };
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <form
          onSubmit={handleNext}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "80%",
            backgroundColor: "white",
            borderRadius: "25px",
            padding: "1%",
            marginTop: "1%",
          }}
        >
          <Stepper steps={formSteps} currentStep={currentStep} />
          <button type="submit" className="step-button">
            <span>{currentStep === formSteps.length ? "Submit" : "Next"}</span>
          </button>
        </form>
      )}
    </>
  );
};

export default React.memo(Form);
