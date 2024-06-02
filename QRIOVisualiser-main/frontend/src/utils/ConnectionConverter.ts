import { Edge } from "reactflow";

export const connectionConverter = (edges: Edge<any>[]) => {
  let connectionArray: number[][] = [];
  let connectionSet: Set<string> = new Set<string>();
  edges.forEach((edge) => {
    const arr = [parseInt(edge.source) - 1, parseInt(edge.target) - 1];
    const stringifiedArr = JSON.stringify(arr);

    if (!connectionSet.has(stringifiedArr)) {
      connectionSet.add(stringifiedArr);
      connectionArray.push(arr);
    }
  });
  return connectionArray;
};
