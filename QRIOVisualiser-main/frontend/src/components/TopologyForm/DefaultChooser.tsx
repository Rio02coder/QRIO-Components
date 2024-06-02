import React from "react";
import { OrText } from "../../pages/FileUpload";
import ChooserBox from "../FileUpload/ChooserBox";

type TProps = {
  children: React.ReactNode[];
};

const DefaultChooser = ({ children }: TProps) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ChooserBox marginBottom="5%">
        {children.map((node, index) => {
          return (
            <>
              {node}
              {index !== children.length - 1 && <OrText />}
            </>
          );
        })}
      </ChooserBox>
    </div>
  );
};

export default DefaultChooser;
