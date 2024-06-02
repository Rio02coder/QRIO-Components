import React from "react";

type TProps = {
  height?: string;
};

const Logo = (props: TProps) => {
  return (
    <img
      src={require("../logos/Qube_transparent.png")}
      alt="Logo"
      style={{ height: props.height ? props.height : "20%" }}
    />
  );
};

export default Logo;
