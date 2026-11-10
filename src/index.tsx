import { render } from "ink";
import App from "./app.js";
import { MouseProvider } from "./components/mouse.js";

async function main() {
  const { waitUntilExit } = render(
    <MouseProvider>
      <App />
    </MouseProvider>,
    { alternateScreen: true },
  );
  await waitUntilExit();
}

main();
