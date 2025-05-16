
import React from "react";

interface LocationLabelProps {
  name: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
}

const LocationLabel = ({ name, position }: LocationLabelProps) => {
  // We're now showing the name directly with the pin, so we'll hide this component
  return null;
};

export default LocationLabel;
