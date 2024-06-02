import React, { ChangeEvent } from "react";
import "../../styles/components/FileUpload/UploadButtonStyles.css";

type TProps = {
  text: string;
  textColor: string;
  backgroundColor: string;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
} & React.CSSProperties;

const UploadButton = (props: TProps) => {
  return (
    <label className="button_container">
      <input
        type="file"
        id="fileInput"
        accept=".qasm"
        onChange={props.handleFileChange}
        style={{ display: "none", height: 0 }}
      />
      <div className="text">{props.text}</div>
    </label>
  );
};

export default React.memo(UploadButton);
