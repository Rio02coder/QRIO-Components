import React, { useContext } from "react";
import "../../../styles/components/JobInfo/LogBox/LogChecker.css";
import axios, { AxiosResponse } from "axios";
import { BASE_URL } from "../../../backend/server";
import { JobContext } from "../../../types/JobContext";

type TProps = {
  onLogRetrieval: (res: AxiosResponse<any, any>) => void;
};

const LogChecker = ({ onLogRetrieval }: TProps) => {
  const jobContext = useContext(JobContext);
  const onPress = () => {
    axios.get(BASE_URL + "get-logs/" + jobContext?.jobName).then((res) => {
      onLogRetrieval(res);
    });
  };
  return (
    <button className="logbutton" onClick={onPress}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
        ></path>
      </svg>

      <div className="text">Check Logs</div>
    </button>
  );
};

export default React.memo(LogChecker);
