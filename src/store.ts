import { createStore } from "./create-store.js";
import type { LocationId } from "./locations.js";

export type SceneName =
  | "home-screen"
  | "exploration"
  | "tartaros"
  | "battle"
  | "credits";

export interface Scene {
  name: SceneName;
  props?: {
    locationId?: LocationId;
    [key: string]: any;
  };
}

export interface StoreState {
  sceneStack: Scene[];
}

export const store = createStore<StoreState>({
  sceneStack: [{ name: "home-screen" }],
});

export const { useStore, useField, getState, setState, subscribe } = store;
