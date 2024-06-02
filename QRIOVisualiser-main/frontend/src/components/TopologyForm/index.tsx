import React, { useContext, useState } from "react";
import QubitCanvas from "./QubitCanvas";
import TopologyButton from "./TopologyButton";
import { JobContext } from "../../types/JobContext";
import CircuitGenerator from "../../utils/CircuitGenerator";
import DefaultChooser from "./DefaultChooser";
import FidelitySlider from "./FidelitySlider";

type FormState = {
  setFidelity: boolean;
  setTopology: boolean;
  drawTopology: boolean;
};

const TopologyForm = () => {
  const jobContext = useContext(JobContext);
  const qubits = jobContext ? jobContext.qubits : 0;
  // const [isCreatingCircuit, setCreatingCircuit] = useState<boolean>(false);
  const [formState, setFormState] = useState<FormState>({
    drawTopology: false,
    setFidelity: false,
    setTopology: false,
  });
  const getAlertString = () => {
    return `Fully connected ${
      jobContext ? jobContext.qubits : 0
    } circuit has been generated`;
  };

  const getFormComponent = () => {
    if (
      !formState.setFidelity &&
      !formState.setTopology &&
      !formState.drawTopology
    ) {
      return (
        <DefaultChooser>
          <TopologyButton
            onClick={() => setFormState({ ...formState, setFidelity: true })}
            text="Use Fidelity"
          />
          <TopologyButton
            onClick={() => setFormState({ ...formState, setTopology: true })}
            text="Use Topology"
          />
        </DefaultChooser>
      );
    }
    if (formState.setTopology && formState.drawTopology) {
      return <QubitCanvas />;
    }
    if (formState.setTopology) {
      return (
        <DefaultChooser>
          <TopologyButton
            onClick={() => setFormState({ ...formState, drawTopology: true })}
            text="Draw Topology"
          />
          <TopologyButton
            onClick={() => {
              const cg: CircuitGenerator = new CircuitGenerator(
                qubits,
                undefined,
                true
              );
              const fullyConnectedTopologyFile: File = cg.generateCircuitFile();
              jobContext?.setJobData({
                topologyFile: fullyConnectedTopologyFile,
              });
              alert(getAlertString());
            }}
            text="Use Default"
          />
        </DefaultChooser>
      );
    } else {
      return <FidelitySlider />;
    }
  };

  return (
    <>
      {/* {!isCreatingCircuit ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ChooserBox marginBottom="5%">
            <TopologyButton onClick={() => {}} text="Set Fidelity" />
            <OrText />
            <TopologyButton
              onClick={() => {
                setCreatingCircuit(true);
              }}
              text="Draw Topology"
            />{" "}
            <OrText />{" "}
            <TopologyButton
              onClick={() => {
                const cg: CircuitGenerator = new CircuitGenerator(
                  qubits,
                  undefined,
                  true
                );
                const fullyConnectedTopologyFile: File =
                  cg.generateCircuitFile();
                jobContext?.setJobData({
                  topologyFile: fullyConnectedTopologyFile,
                });
                alert(getAlertString());
              }}
              text="Use Default"
            />
          </ChooserBox>
        </div>
      ) : (
        <QubitCanvas />
      )} */}
      {getFormComponent()}
    </>
  );
};

export default React.memo(TopologyForm);
