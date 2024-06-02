import React from "react";
import "../../styles/components/TopologyForm/TopologyButton.css";

type TProps = {
  onClick: () => void;
  text: string;
};

const TopologyButton = ({ onClick, text }: TProps) => {
  return (
    <button className="topology-button" onClick={onClick} type="button">
      <span>{text}</span>
    </button>
  );
};

export default React.memo(TopologyButton);
