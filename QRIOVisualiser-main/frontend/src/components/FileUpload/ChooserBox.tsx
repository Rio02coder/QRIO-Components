import React, { ReactNode } from "react";
import chooserBoxStyles, {
  TProps,
} from "../../styles/components/FileUpload/ChooserBoxStyles";

type ChooserBoxProps = TProps & {
  children?: ReactNode;
};

const ChooserBox = ({
  children,
  width,
  height,
  backgroundColor,
  borderColor,
  borderStyle,
  borderWidth,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
}: ChooserBoxProps) => {
  const styles = chooserBoxStyles({
    width,
    height,
    backgroundColor,
    borderWidth,
    borderColor,
    borderStyle,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
  });
  return <div style={styles}>{children}</div>;
};

export default React.memo(ChooserBox);
