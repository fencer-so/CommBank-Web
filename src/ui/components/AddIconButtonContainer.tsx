import React, { ReactNode } from "react";

interface AddIconButtonContainerProps {
  condition: boolean;
  children: ReactNode;
  wrapper?: (children: ReactNode) => JSX.Element; // Optional wrapper function
}

const AddIconButtonContainer: React.FC<AddIconButtonContainerProps> = ({ condition, children, wrapper }) => {
  if (!condition) return null;
  return wrapper ? wrapper(children) : <>{children}</>;
};

export default AddIconButtonContainer;