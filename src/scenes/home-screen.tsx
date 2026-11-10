import { Box, Text, useApp } from "ink";
import Button from "../components/button.js";
import ButtonText from "../components/button-text.js";
import { useField } from "../store.js";

const LOGO_P3 = [
  "",
  "███████╗██████╗ ",
  "██╔═══██║╚════██╗",
  "███████╔╝ █████╔╝",
  "██╔════╝  ╚═══██╗",
  "██║      ██████╔╝",
  "╚═╝      ╚═════╝ ",
];

const WINDOW_MOON_BG = [
  "│       *              .      _.-''''''-._        │ ░▒▓",
  "│              ·            .'    ◌    .  '.      │ ░▒▓",
  "│     .                    /   .    ◌    .  \\     │ ░▒▓",
  "│                         ;  ◌    .    .   ◌ ;    │ ░▒▓",
  "│            *            │    .    ◌    .   │    │ ░▒▓",
  "│                         ;  .    ◌    .   ◌ ;    │ ░▒▓",
  "│      ·                   \\   ◌    .    .  /     │ ░▒▓",
  "│                           '.    .    ◌  .'      │ ░▒▓",
  "├────────────────┬────────────'───....───'────────┤ ░▒▓",
  "│                │     ·                          │ ░▒▓",
  "│    ~ ~ ~       │          ~ ~ ~ ~ ~             │ ░▒▓",
  "│  ~ ~ ~ ~ ~ ~ ~ │ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~      │ ░▒▓",
  "│ ~ ~ ~ ~ ~ ~ ~ ~│~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~   │ ░▒▓",
  "│                │                                │ ░▒▓",
  "│                │                                │ ░▒▓",
  "│                │                                │ ░▒▓",
  "╰────────────────┴────────────────────────────────╯ ░▒▓",
];

export default function HomeScreen() {
  const app = useApp();
  const [, setSceneStack] = useField("sceneStack");

  const startNewGame = () => {
    setSceneStack((stack) => [...stack, { name: "exploration", props: { locationId: "iwatodai-station" } }]);
  };

  const openCredits = () => {
    setSceneStack((stack) => [...stack, { name: "credits" }]);
  };

  return (
    <Box width="100%" height="100%">
      {/* 左上背景：教室窗框与满月 ASCII */}
      <Box position="absolute" left={2} top={1} flexDirection="column">
        {WINDOW_MOON_BG.map((line, i) => (
          <Text key={i} color={i === 4 || i === 9 ? "#1e3a8a" : "#38bdf8"} dimColor>
            {line}
          </Text>
        ))}
      </Box>

      {/* 右上：P3 PERSONA 3 RELOAD Logo */}
      <Box position="absolute" right={6} top={2} flexDirection="column" alignItems="flex-end">
        {LOGO_P3.map((line, i) => (
          <Text key={i} color="#38bdf8" bold>
            {line}
          </Text>
        ))}
        <Text color="#ffffff" bold>
          P E R S O N A 3
        </Text>
        <Box>
          <Text backgroundColor="#00b4ff" color="#00b4ff">
            {"    "}
          </Text>
          <Text backgroundColor="#00b4ff" color="#050b14" bold>
            {" T E R "}
          </Text>
          <Text color="#ffffff" bold>
            {"M I N A L "}
          </Text>
        </Box>
      </Box>

      {/* 右下：主菜单（NEW GAME / LOAD GAME / CONFIG） */}
      <Box position="absolute" right={6} bottom={3} flexDirection="column" alignItems="flex-end">
        <Button onClick={startNewGame}>
          <ButtonText> NEW GAME </ButtonText>
        </Button>
        <Button>
          <ButtonText> LOAD GAME </ButtonText>
        </Button>
        <Button>
          <ButtonText> CONFIG </ButtonText>
        </Button>
      </Box>

      {/* 最右下角：底栏按钮 */}
      <Box position="absolute" right={2} bottom={1} gap={2}>
        <Button onClick={openCredits}>
          <ButtonText color="#93c5fd"> Credits </ButtonText>
        </Button>
        <Button onClick={() => app.exit()}>
          <ButtonText color="#93c5fd"> End Game </ButtonText>
        </Button>
      </Box>
    </Box>
  );
}
