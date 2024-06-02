import React from "react";

const Loading = () => {
  return <img alt="Loading" src={require("../../logos/Loading.gif")} />;
};

export default React.memo(Loading);
