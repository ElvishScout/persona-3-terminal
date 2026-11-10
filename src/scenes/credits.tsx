import { Box, Text, useInput } from "ink";
import Button from "../components/button.js";
import ButtonText from "../components/button-text.js";
import { useField } from "../store.js";

const CREDITS_GROUPS = [
  {
    role: "ORIGINAL WORK",
    value: "ATLUS — Persona 3 Reload",
  },
  {
    role: "TERMINAL EDITION",
    value: "Persona 3 Terminal",
  },
  {
    role: "BUILT WITH",
    value: "React 19 · Ink · Yoga Layout · Xterm Mouse",
  },
];

export default function Credits() {
  const [, setSceneStack] = useField("sceneStack");

  const goBack = () => {
    setSceneStack((stack) => (stack.length > 1 ? stack.slice(0, -1) : stack));
  };

  useInput((_, key) => {
    if (key.escape || key.backspace) {
      goBack();
    }
  });

  return (
    <Box
      width="100%"
      height="100%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        flexDirection="column"
        alignItems="center"
        borderStyle="single"
        borderColor="#1d4ed8"
        paddingX={6}
        paddingY={2}
        gap={1}
      >
        <Box marginBottom={1}>
          <Text backgroundColor="#00b4ff" color="#050b14" bold>
            {" C R E "}
          </Text>
          <Text color="#ffffff" bold>
            {"D I T S "}
          </Text>
        </Box>

        {CREDITS_GROUPS.map((item) => (
          <Box
            key={item.role}
            flexDirection="column"
            alignItems="center"
            marginY={0}
          >
            <Text color="#38bdf8" bold>
              {item.role}
            </Text>
            <Text color="#ffffff">{item.value}</Text>
          </Box>
        ))}

        <Box marginTop={1}>
          <Button onClick={goBack}>
            <ButtonText> BACK </ButtonText>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
