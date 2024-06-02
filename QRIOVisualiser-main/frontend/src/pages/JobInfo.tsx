import React, { useState } from "react";
import MainText from "../components/JobInfo/MainText";
import LogBox from "../components/JobInfo/LogBox";

const JobInfo = () => {
  const [device, setDevice] = useState<string>();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "80%",
        height: "70vh",
        borderRadius: "25px",
        backgroundColor: "white",
        padding: "1%",
        marginTop: "1%",
        alignItems: "center",
      }}
    >
      <MainText deviceName={device as string} />
      <LogBox setDevice={setDevice} />
    </div>
  );
};

export default React.memo(JobInfo);
