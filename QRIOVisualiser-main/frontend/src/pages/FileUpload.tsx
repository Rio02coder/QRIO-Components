import React, { ChangeEvent, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import ChooserBox from "../components/FileUpload/ChooserBox";
import ChooserButton from "../components/FileUpload/Button";
import UploadButton from "../components/FileUpload/UploadButton";
import { JobContext } from "../types/JobContext";
import "../styles/components/FileUpload/Main.css";

export const OrText = () => {
  return (
    <p key={2} style={{ color: "grey", fontFamily: "Poppins-ExtraLight" }}>
      Or
    </p>
  );
};

const FileUpload: React.FC = () => {
  const jobContext = useContext(JobContext);
  // const [isLoading, setLoading] = useState<boolean>(false);
  // useEffect(() => {
  //   if (!jobContext) {
  //     setLoading(true);
  //   } else {
  //     setLoading(false);
  //   }
  // }, [jobContext]);

  const navigate = useNavigate();
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      jobContext?.setJobData({ circuitFile: event.target.files[0] });
      navigate("/form");
    }
  };

  return (
    <div className="box gradDynamic">
      <Logo />
      <ChooserBox>
        <UploadButton
          key={1}
          backgroundColor="#FF204E"
          textColor="white"
          text="Choose Circuit"
          handleFileChange={handleFileChange}
        />
        <OrText />
        <ChooserButton
          key={3}
          backgroundColor="#12486B"
          textColor="white"
          onClick={() => {
            navigate("/cluster-info");
          }}
          text="View Cluster"
        />
      </ChooserBox>
    </div>
  );
};

export default FileUpload;
