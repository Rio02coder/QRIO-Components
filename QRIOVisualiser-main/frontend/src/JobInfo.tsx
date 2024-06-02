import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NodeInfo from "./components/NodeInfo";
// import LogInfo from "./components/LogInfo";
import "./App.css";

const JobInfo = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const jobName = searchParams.get("jobName");

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    jobName ? setLoading(false) : setLoading(true);
  }, [jobName]);

  return !loading ? (
    <div>
      <NodeInfo jobName={jobName as string} />
      {/* <LogInfo jobName={jobName as string} /> */}
    </div>
  ) : (
    <></>
  );
};

export default JobInfo;
