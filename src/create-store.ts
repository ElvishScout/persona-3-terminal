import { useCallback, useSyncExternalStore } from "react";

/** 叶子类型：遇到这些就不再向下展开 */
type Leaf =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined
  | Date
  | RegExp
  | Function
  | readonly unknown[];

/** 判断 any，避免 any 造成无限递归 */
type IsAny<T> = 0 extends 1 & T ? true : false;

/**
 * 提取对象类型的所有点分路径
 * 中间节点也会被保留，例如 { a: { b: 1 } } => "a" | "a.b"
 */
export type DeepPath<T> =
  IsAny<T> extends true
    ? never
    : T extends Leaf
      ? never
      : T extends object
        ? {
            [K in keyof T & string]: K | `${K}.${DeepPath<NonNullable<T[K]>>}`;
          }[keyof T & string]
        : never;

/** 根据点分路径提取对应字段的值类型 */
export type PathValue<T, P extends string> =
  IsAny<T> extends true
    ? any
    : T extends unknown // 触发分配，让联合类型逐个匹配
      ? P extends `${infer K}.${infer Rest}`
        ? K extends keyof T
          ? PathValue<NonNullable<T[K]>, Rest> // 中间节点去掉 undefined 继续下钻
          : never
        : P extends keyof T
          ? T[P] // 叶子节点保留原始类型（含 undefined）
          : never
      : never;

export type SetStateAction<T> = T | ((prev: T) => T);
type Listener = () => void;

/** 按点分路径安全读取对象属性 */
function getByPath(target: unknown, path: readonly string[]): unknown {
  let current: any = target;
  for (const segment of path) {
    if (current == null) {
      return undefined;
    }
    current = current[segment];
  }
  return current;
}

/** 按点分路径不可变地更新对象属性（带结构共享，值未变时直接返回原引用） */
function setByPath<T, V>(
  target: T,
  path: readonly string[],
  updater: SetStateAction<V>,
): T {
  const [head, ...rest] = path;
  if (head === undefined) {
    return (
      typeof updater === "function"
        ? (updater as (prev: T) => T)(target)
        : updater
    ) as unknown as T;
  }

  const currentObj =
    target != null && typeof target === "object"
      ? (target as Record<string, unknown>)
      : {};

  const prevChild = currentObj[head];
  const nextChild =
    rest.length === 0
      ? typeof updater === "function"
        ? (updater as (prev: V) => V)(prevChild as V)
        : updater
      : setByPath(prevChild, rest, updater);

  if (Object.is(prevChild, nextChild)) {
    return target;
  }

  return {
    ...currentObj,
    [head]: nextChild,
  } as T;
}

/** 创建一个类型安全的轻量级 Store */
export function createStore<State extends object>(initialState: State) {
  let state: State = initialState;
  const listeners = new Set<Listener>();

  function subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function getState(): State {
    return state;
  }

  function setState(updater: SetStateAction<State>): void {
    const nextState =
      typeof updater === "function"
        ? (updater as (prev: State) => State)(state)
        : updater;

    if (Object.is(nextState, state)) {
      return;
    }
    state = nextState;
    for (const listener of listeners) {
      listener();
    }
  }

  /** 订阅整个 Store 或通过 selector 订阅派生状态 */
  function useStore(): State;
  function useStore<T>(selector: (state: State) => T): T;
  function useStore<T>(
    selector: (state: State) => T = (s) => s as unknown as T,
  ): T {
    const getSnapshot = useCallback(() => selector(state), [selector]);
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  }

  /** 按点分路径读写 Store 中的任意字段，仅在该字段变化时触发重渲染 */
  function useField<P extends DeepPath<State>>(
    path: P,
  ): [
    PathValue<State, P>,
    (value: SetStateAction<PathValue<State, P>>) => void,
  ] {
    type Value = PathValue<State, P>;

    const getSnapshot = useCallback(
      () => getByPath(state, path.split(".")) as Value,
      [path],
    );

    const value = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

    const setValue = useCallback(
      (updater: SetStateAction<Value>) => {
        const segments = path.split(".");
        setState((prev) => setByPath(prev, segments, updater));
      },
      [path],
    );

    return [value, setValue];
  }

  return {
    getState,
    setState,
    subscribe,
    useStore,
    useField,
  };
}
