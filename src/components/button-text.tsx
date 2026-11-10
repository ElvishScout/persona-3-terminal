import { Text, type TextProps } from "ink";
import { useContext } from "react";
import { HoverContext } from "./button.js";

export default function ButtonText(props: TextProps) {
  const hover = useContext(HoverContext);
  return (
    <Text
      bold
      color="#ffffff"
      {...(hover ? { backgroundColor: "#0026ff" } : {})}
      {...props}
    />
  );
}
