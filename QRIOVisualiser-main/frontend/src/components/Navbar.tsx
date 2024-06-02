// import { useState } from "react";
import styles from "../styles/components/Navbar.module.css";
import LinkTag from "./LinkTag";
import Logo from "./Logo";

function Navbar() {
  // adding the states
  // const [isActive, setIsActive] = useState<boolean>(false);

  //add the active class
  // const toggleActiveClass = () => {
  //   setIsActive(!isActive);
  // };

  // //clean up function to remove the active class
  // const removeActive = () => {
  //   setIsActive(false);
  // };

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        <li>
          <LinkTag link="/" Child={<Logo height="100%" />} />{" "}
        </li>
      </ul>
      {/* <div className={styles.downloadContainer}>
        <h2 style={{ color: "white" }}> Cluster</h2>
      </div> */}
    </div>
  );
}

export default Navbar;
