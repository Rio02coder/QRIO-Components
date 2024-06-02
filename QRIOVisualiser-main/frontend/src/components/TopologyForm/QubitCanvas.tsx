import { useCallback, useContext, useMemo, useRef } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  updateEdge,
  Edge,
  Connection,
  BackgroundVariant,
  ControlButton,
} from "reactflow";

import "reactflow/dist/style.css";
import { qubitGenerator } from "../../utils/QubitGenerator";
import { JobContext } from "../../types/JobContext";
import TextUpdaterNode from "./Qubit";
import { connectionConverter } from "../../utils/ConnectionConverter";
import CircuitGenerator from "../../utils/CircuitGenerator";

type TProps = {
  fullyConnected?: boolean;
};

export default function QubitCanvas({ fullyConnected = false }: TProps) {
  const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);
  const edgeUpdateSuccessful = useRef(true);
  const jobContext = useContext(JobContext);
  const [nodes, , onNodesChange] = useNodesState(
    qubitGenerator(jobContext ? jobContext.qubits : 0)
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((els) => addEdge(params, els)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      edgeUpdateSuccessful.current = true;
      setEdges((els) => updateEdge(oldEdge, newConnection, els));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onEdgeUpdateEnd = useCallback((_: any, edge: { id: string }) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createTopologyFile = () => {
    const connections: number[][] = connectionConverter(edges);
    const cg: CircuitGenerator = new CircuitGenerator(
      jobContext ? jobContext.qubits : 0,
      connections,
      false
    );
    const topologyFile: File = cg.generateCircuitFile();
    jobContext?.setJobData({ topologyFile: topologyFile });
    alert("Your topology has been set");
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        snapToGrid
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
        attributionPosition="top-right"
      >
        <Background variant={BackgroundVariant.Dots} />
        <MiniMap />
        <Controls>
          <ControlButton onClick={createTopologyFile}>
            <span>&#10003;</span>
          </ControlButton>
        </Controls>
      </ReactFlow>
    </div>
  );
}
