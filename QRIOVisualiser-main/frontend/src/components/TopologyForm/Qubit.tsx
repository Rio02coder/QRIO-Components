import { Handle, Position } from "reactflow";

export default function TextUpdaterNode({ data }: { data: { value: number } }) {
  return (
    <>
      <Handle type="target" position={Position.Top} id="a" />
      <Handle type="target" position={Position.Left} id="b" />
      <div
        style={{
          background:
            "linear-gradient(90deg, rgba(29,37,253,1) 41%, rgba(173,69,252,1) 100%)",
          height: "3.5vh",
          width: "2vw",
          display: "flex",
          justifyContent: "center",
          fontSize: "1vmin",
          alignItems: "center",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          fontFamily: "Poppins-Bold",
          color: "white",
        }}
      >
        {data.value}
      </div>
      <Handle type="source" position={Position.Bottom} id="c" />
      <Handle type="source" position={Position.Right} id="d" />
    </>
  );
}
