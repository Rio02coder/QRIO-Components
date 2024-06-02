import React from "react";
import "../../styles/components/FileUpload/ClusterButtonStyles.css";

type TProps = {
  onClick: () => void;
  text: string;
  textColor: string;
  backgroundColor: string;
};

const ChooserButton = (props: TProps) => {
  return (
    <button
      className="button"
      onClick={props.onClick}
      // style={{
      //   backgroundColor: props.backgroundColor,
      //   color: props.textColor,
      //   height: "20%",
      //   width: "30%",
      //   fontFamily: "Poppins-Bold",
      //   textAlign: "center",
      //   fontSize: "2vh",
      //   border: "none",
      //   borderRadius: "25px",
      //   boxShadow: "2px 5px 10px rgba(0, 0, 0, 0.1)",
      //   transition: "box-shadow 0.3s ease",
      //   whiteSpace: "nowrap",
      //   cursor: "pointer",
      // }}
      // onMouseEnter={(e) => {
      //   // (e.target as HTMLButtonElement).style.backgroundColor = "#ffa500"; // Change background color on hover
      //   (e.target as HTMLButtonElement).style.boxShadow =
      //     "3px 7px 10px rgba(0, 0, 0, 0.2)"; // Add shadow on hover
      // }}
      // onMouseLeave={(e) => {
      //   // (e.target as HTMLButtonElement).style.backgroundColor =
      //   //   props.backgroundColor; // Restore original background color when not hovering
      //   (e.target as HTMLButtonElement).style.boxShadow = "none"; // Remove shadow when not hovering
      // }}
    >
      <svg
        className="svgIcon"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm50.7-186.9L162.4 380.6c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31L325.1 306.7c-3.2 8.5-9.9 15.1-18.4 18.4zM288 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"></path>
      </svg>
      <div className="text">{props.text}</div>
    </button>
  );
};

export default ChooserButton;
