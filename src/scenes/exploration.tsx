import { Box, Text } from "ink";
import { useContext, useEffect, useState } from "react";
import Button, { HoverContext } from "../components/button.js";
import { MouseBox } from "../components/mouse.js";
import {
  LOCATIONS,
  type DialogueMessage,
  type Hotspot,
  type LocationId,
} from "../locations.js";

function HotspotMarker({
  hotspot,
  active,
  inspected,
  onSelect,
}: {
  hotspot: Hotspot;
  active: boolean;
  inspected: boolean;
  onSelect: () => void;
}) {
  return (
    <Box position="absolute" left={hotspot.x} top={hotspot.y}>
      <Button onClick={onSelect}>
        <HotspotBadge
          hotspot={hotspot}
          active={active}
          inspected={inspected}
        />
      </Button>
    </Box>
  );
}

function HotspotBadge({
  hotspot,
  active,
  inspected,
}: {
  hotspot: Hotspot;
  active: boolean;
  inspected: boolean;
}) {
  const hover = useContext(HoverContext);
  const highlighted = hover || active;

  return (
    <Text
      bold
      color={highlighted ? "#ffffff" : inspected ? "#94a3b8" : hotspot.tagColor}
      {...(highlighted ? { backgroundColor: "#0026ff" } : {})}
    >
      {` ${hotspot.icon} ${hotspot.label} `}
    </Text>
  );
}

export interface ExplorationSceneProps {
  locationId?: LocationId;
}

export default function ExplorationScene({
  locationId: initialLocationId = "iwatodai-station",
}: ExplorationSceneProps) {
  const [currentLocationId, setCurrentLocationId] =
    useState<LocationId>(initialLocationId);

  const location = LOCATIONS[currentLocationId];

  const [activeMessages, setActiveMessages] = useState<DialogueMessage[]>(
    () => location.introMessages ?? [],
  );
  const [msgIndex, setMsgIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [inspectedMap, setInspectedMap] = useState<
    Partial<Record<LocationId, Set<string>>>
  >({});

  useEffect(() => {
    setCurrentLocationId(initialLocationId);
  }, [initialLocationId]);

  const switchToLocation = (nextId: LocationId) => {
    const nextLocation = LOCATIONS[nextId];
    setCurrentLocationId(nextId);
    setActiveHotspot(null);
    setActiveMessages(nextLocation.introMessages ?? []);
    setMsgIndex(0);
  };

  const inspectedIds = inspectedMap[currentLocationId] ?? new Set<string>();
  const currentMessage = activeMessages[msgIndex];

  const handleSelectHotspot = (hotspot: Hotspot) => {
    setInspectedMap((prev) => {
      const nextSet = new Set(prev[currentLocationId]);
      nextSet.add(hotspot.id);
      return { ...prev, [currentLocationId]: nextSet };
    });

    if (hotspot.messages && hotspot.messages.length > 0) {
      setActiveHotspot(hotspot);
      setActiveMessages(hotspot.messages);
      setMsgIndex(0);
    } else if (hotspot.moveToLocation) {
      switchToLocation(hotspot.moveToLocation);
    }
  };

  const handleAdvanceDialogue = () => {
    if (msgIndex < activeMessages.length - 1) {
      setMsgIndex((i) => i + 1);
      return;
    }

    const nextLocationId = activeHotspot?.moveToLocation;
    setActiveMessages([]);
    setActiveHotspot(null);

    if (nextLocationId) {
      switchToLocation(nextLocationId);
    }
  };

  return (
    <Box width="100%" height="100%" flexDirection="column">
      {/* 中部：场景画布 + P3R 风格浮动 HUD */}
      <Box flexGrow={1}>
        {/* 背景字符画与精灵层 */}
        <Box position="absolute" left={2} top={2} flexDirection="column">
          {location.background.map((line, i) => (
            <Text
              key={i}
              {...(line.color ? { color: line.color } : {})}
              {...(line.dimColor !== undefined
                ? { dimColor: line.dimColor }
                : {})}
              {...(line.bold !== undefined ? { bold: line.bold } : {})}
            >
              {line.text}
            </Text>
          ))}

          {location.sprites?.map((sprite, sIdx) => (
            <Box
              key={sIdx}
              position="absolute"
              left={sprite.x}
              top={sprite.y}
              flexDirection="column"
            >
              {sprite.lines.map((line, lIdx) => (
                <Text
                  key={lIdx}
                  {...(line.color ? { color: line.color } : {})}
                  {...(line.dimColor !== undefined
                    ? { dimColor: line.dimColor }
                    : {})}
                  {...(line.bold !== undefined ? { bold: line.bold } : {})}
                >
                  {line.text}
                </Text>
              ))}
            </Box>
          ))}
        </Box>

        {/* P3P 风格可点击调查点 */}
        {location.hotspots.map((hotspot) => (
          <HotspotMarker
            key={hotspot.id}
            hotspot={hotspot}
            active={activeHotspot?.id === hotspot.id}
            inspected={inspectedIds.has(hotspot.id)}
            onSelect={() => handleSelectHotspot(hotspot)}
          />
        ))}

        {/* 右上角 HUD：P3R 标志性的日期 + 星期 + 时间段 + 月相 + 当前目标 */}
        <Box
          position="absolute"
          right={2}
          top={0}
          flexDirection="column"
          alignItems="flex-end"
        >
          <Box gap={1}>
            <Text backgroundColor="#0026ff" color="#ffffff" bold>
              {` ${location.date} `}
            </Text>
            <Text backgroundColor="#050b14" color="#ffffff" bold>
              {` ${location.dayOfWeek} `}
            </Text>
            <Text color={location.timeColor ?? "#38bdf8"} bold>
              {location.timeOfDay}
            </Text>
            {location.moonPhase && (
              <Text>{location.moonPhase}</Text>
            )}
          </Box>
          {location.objective && (
            <Box marginTop={0}>
              <Text color="#00b4ff" bold>
                {"! "}
              </Text>
              <Text backgroundColor="#0f172a" color="#e2e8f0">
                {`「 ${location.objective} 」`}
              </Text>
            </Box>
          )}
        </Box>

        {/* 左下角 HUD：P3R 地点铭牌 */}
        <Box position="absolute" left={2} bottom={0}>
          <Text backgroundColor="#0f172a" color="#ffffff" bold>
            {` ◈ ${location.name} `}
          </Text>
        </Box>
      </Box>

      {/* 底部：通用对话框（点击推进或关闭对话） */}
      <MouseBox
        width="100%"
        height={5}
        borderStyle="round"
        borderColor={currentMessage ? "#00b4ff" : "#1e3a8a"}
        paddingX={2}
        flexDirection="column"
        justifyContent="space-between"
        onClick={handleAdvanceDialogue}
      >
        {currentMessage ? (
          <>
            <Box gap={1}>
              {currentMessage.speaker && (
                <Text backgroundColor="#0026ff" color="#ffffff" bold>
                  {` ${currentMessage.speaker} `}
                </Text>
              )}
              <Text color="#ffffff">{currentMessage.text}</Text>
            </Box>
            <Box justifyContent="space-between" width="100%">
              <Text color="#64748b">
                Click hotspot on screen to investigate
              </Text>
              <Text color="#00b4ff" bold>
                {msgIndex < activeMessages.length - 1
                  ? "▼ CLICK TO CONTINUE"
                  : "■ CLICK TO CLOSE"}
              </Text>
            </Box>
          </>
        ) : (
          <Box
            height="100%"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <Text color="#93c5fd">
              Move cursor and click on any marker to investigate.
            </Text>
            <Text color="#38bdf8">
              Inspected: {inspectedIds.size} / {location.hotspots.length}
            </Text>
          </Box>
        )}
      </MouseBox>
    </Box>
  );
}
