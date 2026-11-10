import { Box, Text, useApp, useWindowSize } from "ink";
import { useField, type SceneName } from "./store.js";
import { MouseBox } from "./components/mouse.js";
import { Activity, type ComponentType } from "react";
import Battle from "./scenes/battle.js";
import Credits from "./scenes/credits.js";
import ExplorationScene from "./scenes/exploration.js";
import HomeScreen from "./scenes/home-screen.js";
import Tartaros from "./scenes/tartaros.js";

const SCENE_MAP: Record<SceneName, ComponentType<any>> = {
  "home-screen": HomeScreen,
  exploration: ExplorationScene,
  tartaros: Tartaros,
  battle: Battle,
  credits: Credits,
};

export default function App() {
  const app = useApp();

  const [sceneStack, setSceneStack] = useField("sceneStack");

  const { columns, rows } = useWindowSize();

  return (
    <Box width={columns} height={rows} flexDirection="column">
      <Box flexGrow={1}>
        {sceneStack.map((scene, i) => {
          const visible = i === sceneStack.length - 1;
          const Component = SCENE_MAP[scene.name];

          return (
            <Activity key={i} mode={visible ? "visible" : "hidden"}>
              <Component {...scene.props} />
            </Activity>
          );
        })}
      </Box>

      <Box flexDirection="row" justifyContent="space-between">
        <Box>
          <Text>{sceneStack.map((scene) => scene.name).join(" > ")}</Text>
        </Box>
        <Box>
          <Text>
            {columns} × {rows}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
