type QubitData = {
  id: string;
  data: {
    value: string;
  };
  type: string;
  position: {
    x: number;
    y: number;
  };
};

export const qubitGenerator = (numberOfQubits: number) => {
  const initialQubits: QubitData[] = [];
  let yPos = 250;
  for (let i = 0; i < numberOfQubits; i++, yPos += 120) {
    initialQubits.push({
      id: `${i + 1}`,
      data: {
        value: `${i + 1}`,
      },
      position: {
        x: 250,
        y: yPos,
      },
      type: "textUpdater",
    });
  }
  return initialQubits;
};
