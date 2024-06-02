import React from "react";
import { Link } from "react-router-dom";
type TProps = {
  Child: React.ReactNode;
  link: string;
};

const LinkTag = ({ Child, link }: TProps) => {
  return <Link to={link}>{Child}</Link>;
};

export default React.memo(LinkTag);
