export type TProps = {
  width?: string;
  height?: string;
  borderWidth?: string;
  borderColor?: string;
  backgroundColor?: string;
  borderStyle?: string;
  marginRight?: string;
  marginLeft?: string;
  marginTop?: string;
  marginBottom?: string;
};

const chooserBoxStyles = ({
  width = "85vb",
  height = "25vh",
  backgroundColor = "#d9d7d7",
  borderWidth = "5px",
  borderColor = "#7d7878",
  borderStyle = "dashed",
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
}: TProps): React.CSSProperties => {
  return {
    width,
    height,
    backgroundColor,
    borderStyle,
    borderWidth,
    borderColor,
    alignItems: "center",
    justifyContent: "space-evenly",
    display: "flex",
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    boxShadow: "32px 32px 64px #09cd56, -32px -32px 64px #a8a8a8;",
  };
};

export default chooserBoxStyles;
