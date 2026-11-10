import { createContext, useState } from "react";
import { MouseBox, type MouseBoxProps } from "./mouse.js";

export const HoverContext = createContext(false);

export default function Button({
  children,
  onMouseEnter,
  onMouseLeave,
  ...props
}: MouseBoxProps) {
  const [hover, setHover] = useState(false);

  return (
    <MouseBox
      {...props}
      onMouseEnter={(event) => {
        setHover(true);
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        setHover(false);
        onMouseLeave?.(event);
      }}
    >
      <HoverContext value={hover}>{children}</HoverContext>
    </MouseBox>
  );
}
