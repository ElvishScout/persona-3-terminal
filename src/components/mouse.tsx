import { Box, useStdin, useStdout, type BoxProps, type DOMElement } from "ink";
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { Mouse, type MouseEvent } from "xterm-mouse";
import Yoga from "yoga-layout";

export type { MouseEvent };

export interface MouseEventHandlers {
  onClick?: ((event: MouseEvent) => void) | undefined;
  onMouseEnter?: ((event?: MouseEvent) => void) | undefined;
  onMouseLeave?: ((event?: MouseEvent) => void) | undefined;
  onMouseMove?: ((event: MouseEvent) => void) | undefined;
  onMousePress?: ((event: MouseEvent) => void) | undefined;
  onMouseRelease?: ((event: MouseEvent) => void) | undefined;
  onMouseDrag?: ((event: MouseEvent) => void) | undefined;
  onWheel?: ((event: MouseEvent) => void) | undefined;
}

interface TargetEntry {
  nodeRef: RefObject<DOMElement | null>;
  handlersRef: RefObject<MouseEventHandlers>;
  isHovered: boolean;
}

interface MouseRegistryController {
  entries: Map<string, TargetEntry>;
  lastPosition: { x: number; y: number } | null;
  lastEvent: MouseEvent | null;
}

const MouseRegistryContext = createContext<MouseRegistryController | null>(
  null,
);

/**
 * 检查点 (x, y) 是否命中目标节点
 * - 终端坐标 (x, y) 从 1 开始（1-indexed）
 * - 自动过滤掉被 <Activity mode="hidden"> 或 display="none" 隐藏的节点
 */
function hitTest(node: DOMElement | null, x: number, y: number): boolean {
  if (!node?.yogaNode) {
    return false;
  }

  const { width, height } = node.yogaNode.getComputedLayout();
  if (width <= 0 || height <= 0) {
    return false;
  }

  let current: DOMElement | undefined = node;
  let left = 1;
  let top = 1;

  while (current) {
    const yogaNode = current.yogaNode;
    if (!yogaNode) {
      return false;
    }

    // 任意祖先节点处于隐藏状态（如 Activity hidden），则不响应鼠标事件
    if (yogaNode.getDisplay() === Yoga.DISPLAY_NONE) {
      return false;
    }

    const layout = yogaNode.getComputedLayout();
    left += layout.left;
    top += layout.top;
    current = current.parentNode;
  }

  // 右边界与下边界使用半开区间 `<`，避免多算 1 行 / 1 列的 off-by-one 问题
  return x >= left && x < left + width && y >= top && y < top + height;
}

/** 同步单个节点的 hover 状态，若发生变化则触发 onMouseEnter / onMouseLeave */
function syncEntryHover(
  entry: TargetEntry,
  pos: { x: number; y: number } | null,
  event?: MouseEvent,
): boolean {
  const isInside =
    pos !== null && hitTest(entry.nodeRef.current, pos.x, pos.y);

  if (isInside !== entry.isHovered) {
    entry.isHovered = isInside;
    if (isInside) {
      entry.handlersRef.current.onMouseEnter?.(event);
    } else {
      entry.handlersRef.current.onMouseLeave?.(event);
    }
  }

  return isInside;
}

export function MouseProvider({ children }: { children?: ReactNode }) {
  const { stdin, setRawMode } = useStdin();
  const { stdout } = useStdout();
  const controllerRef = useRef<MouseRegistryController>({
    entries: new Map(),
    lastPosition: null,
    lastEvent: null,
  });

  useEffect(() => {
    if (!Mouse.isSupported(stdin as any, stdout)) {
      return;
    }

    const mouse = new Mouse({
      inputStream: stdin as any,
      outputStream: stdout,
      setRawMode,
    });

    mouse.enable();

    const controller = controllerRef.current;

    const recordPosition = (event: MouseEvent) => {
      controller.lastPosition = { x: event.x, y: event.y };
      controller.lastEvent = event;
    };

    const dispatchPointEvent = (
      event: MouseEvent,
      key: keyof Pick<
        MouseEventHandlers,
        | "onClick"
        | "onMousePress"
        | "onMouseRelease"
        | "onMouseDrag"
        | "onWheel"
      >,
    ) => {
      recordPosition(event);
      // 用快照遍历，防止在事件回调中触发场景切换/卸载影响当前循环
      for (const entry of [...controller.entries.values()]) {
        const handler = entry.handlersRef.current[key];
        if (handler && hitTest(entry.nodeRef.current, event.x, event.y)) {
          handler(event);
        }
      }
    };

    const handleMove = (event: MouseEvent) => {
      recordPosition(event);
      for (const entry of [...controller.entries.values()]) {
        const isInside = syncEntryHover(
          entry,
          controller.lastPosition,
          event,
        );
        if (isInside) {
          entry.handlersRef.current.onMouseMove?.(event);
        }
      }
    };

    const handleClick = (e: MouseEvent) => dispatchPointEvent(e, "onClick");
    const handlePress = (e: MouseEvent) =>
      dispatchPointEvent(e, "onMousePress");
    const handleRelease = (e: MouseEvent) =>
      dispatchPointEvent(e, "onMouseRelease");
    const handleDrag = (e: MouseEvent) => dispatchPointEvent(e, "onMouseDrag");
    const handleWheel = (e: MouseEvent) => dispatchPointEvent(e, "onWheel");

    mouse.on("move", handleMove);
    mouse.on("click", handleClick);
    mouse.on("press", handlePress);
    mouse.on("release", handleRelease);
    mouse.on("drag", handleDrag);
    mouse.on("wheel", handleWheel);

    return () => {
      mouse.destroy();
    };
  }, [stdin, stdout, setRawMode]);

  return (
    <MouseRegistryContext value={controllerRef.current}>
      {children}
    </MouseRegistryContext>
  );
}

export type MouseBoxProps = BoxProps &
  MouseEventHandlers & {
    children?: ReactNode;
  };

/**
 * 支持鼠标事件（onClick / onMouseEnter / onMouseLeave 等）的 Box 组件
 */
export function MouseBox({
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onMousePress,
  onMouseRelease,
  onMouseDrag,
  onWheel,
  children,
  ...boxProps
}: MouseBoxProps) {
  const controller = useContext(MouseRegistryContext);
  if (!controller) {
    throw new Error("MouseBox must be used within a <MouseProvider>");
  }

  const id = useId();
  const nodeRef = useRef<DOMElement | null>(null);
  const handlersRef = useRef<MouseEventHandlers>({
    onClick,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    onMousePress,
    onMouseRelease,
    onMouseDrag,
    onWheel,
  });

  handlersRef.current = {
    onClick,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    onMousePress,
    onMouseRelease,
    onMouseDrag,
    onWheel,
  };

  useEffect(() => {
    const entry: TargetEntry = {
      nodeRef,
      handlersRef,
      isHovered: false,
    };

    controller.entries.set(id, entry);

    // 挂载或 <Activity> 重新变为 visible 时，根据最后已知的鼠标位置立即同步一次 hover 状态
    syncEntryHover(
      entry,
      controller.lastPosition,
      controller.lastEvent ?? undefined,
    );

    return () => {
      controller.entries.delete(id);
      // 卸载或 <Activity> 变为 hidden 时，若原先处于 hover 状态，立即重置并触发 onMouseLeave
      if (entry.isHovered) {
        entry.isHovered = false;
        handlersRef.current.onMouseLeave?.(controller.lastEvent ?? undefined);
      }
    };
  }, [controller, id]);

  return (
    <Box ref={nodeRef} {...boxProps}>
      {children}
    </Box>
  );
}
