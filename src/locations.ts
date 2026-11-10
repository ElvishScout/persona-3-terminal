export type LocationId = "iwatodai-station";

/**
 * Unicode 专用月相符号（U+1F311 ~ U+1F318）
 * 🌑 New Moon | 🌒 Waxing Crescent | 🌓 First Quarter | 🌔 Waxing Gibbous
 * 🌕 Full Moon | 🌖 Waning Gibbous  | 🌗 Last Quarter  | 🌘 Waning Crescent
 */
export type MoonPhase = "🌑" | "🌒" | "🌓" | "🌔" | "🌕" | "🌖" | "🌗" | "🌘";

export interface DialogueMessage {
  speaker?: string;
  text: string;
}

export interface AsciiLine {
  text: string;
  color?: string;
  dimColor?: boolean;
  bold?: boolean;
}

export interface AsciiSprite {
  x: number;
  y: number;
  lines: AsciiLine[];
}

export interface Hotspot {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  tagColor: string;
  messages?: DialogueMessage[];
  /** 对话结束后（或点击时）跳转到的下一个地点 */
  moveToLocation?: LocationId;
}

export interface LocationConfig {
  id: LocationId;
  name: string;
  date: string;
  dayOfWeek: string;
  timeOfDay: string;
  moonPhase?: MoonPhase;
  objective?: string;
  timeColor?: string;
  introMessages?: DialogueMessage[];
  background: AsciiLine[];
  sprites?: AsciiSprite[];
  hotspots: Hotspot[];
}

/**
 * 4/7 深夜：严户台站外广场（Iwatodai Station — Station Front）
 * 主角出站后的第一个可操作场景：身后是车站大门与下行的阶梯，右侧是自动售货机与施工护栏，前方通往商店街与宿舍
 */
const IWATODAI_STATION: LocationConfig = {
  id: "iwatodai-station",
  name: "Iwatodai Station",
  date: "4/7",
  dayOfWeek: "Tue",
  timeOfDay: "Dark Hour",
  moonPhase: "🌔",
  objective: "Head to the dormitory",
  timeColor: "#4ade80",
  introMessages: [
    {
      text: "You step out of Iwatodai Station into the plaza...",
    },
    {
      text: "The streetlights are dead, the sky is a sickly green, and strange coffins stand where people should be.",
    },
  ],
  background: [
    {
      text: "   ·        *                      .        _.-'''-._                     ",
      color: "#4ade80",
    },
    {
      text: "      ╭─────────────────────────────────╮ .'   ◌  .  '.                   ",
      color: "#38bdf8",
    },
    {
      text: "      │     I W A T O D A I   S T A .   │;   .   ◌     ;                  ",
      color: "#38bdf8",
      bold: true,
    },
    {
      text: " ╭────┴─────────────────────────────────┴┴─────────────┴─────────────────╮",
      color: "#38bdf8",
    },
    {
      text: " │  ┌───────────┬───────────┐   [EXIT]     ┌────────┐            ┌─────┐ │",
      color: "#38bdf8",
    },
    {
      text: " │  │ ░░░░░░░░░ │ ░░░░░░░░░ │  ╱══════╲    │ [DRINK]│            │ ░░░ │ │",
      color: "#38bdf8",
    },
    {
      text: " │  │ ░░░░░░░░░ │ ░░░░░░░░░ │ ╱════════╲   │  □□□□  │            │ │ │ │ │",
      color: "#38bdf8",
    },
    {
      text: " │  │ ░░░░░░░░░ │ ░░░░░░░░░ │╱══════════╲  │  ════  │            │ │ │ │ │",
      color: "#38bdf8",
    },
    {
      text: " ╰══╧═══════════╧═══════════╧══════════════╧════════╧════════════╧═════╧═╯",
      color: "#38bdf8",
    },
    {
      text: "   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒░░░░░░░░░░░  ",
      color: "#1d4ed8",
      dimColor: true,
    },
    {
      text: "      ╱                            Street Plaza          ▒▒▒▒             ",
      color: "#1d4ed8",
      dimColor: true,
    },
    {
      text: "     ╱  [▲]══[▲]                                         ▒▒▒▒             ",
      color: "#1d4ed8",
      dimColor: true,
    },
    {
      text: "    ╱                                                    ▒▒▒▒             ",
      color: "#1d4ed8",
      dimColor: true,
    },
  ],
  sprites: [
    // 广场右侧独立区域的血红棺柩
    {
      x: 56,
      y: 4,
      lines: [
        { text: "╭─☥─╮", color: "#ef4444", bold: true },
        { text: "│ █ │", color: "#ef4444", bold: true },
        { text: "│ █ │", color: "#ef4444", bold: true },
        { text: "╰───╯", color: "#991b1b", bold: true },
      ],
    },
    // 广场前方偏左处的另一具棺柩（避开左下出口文字）
    {
      x: 27,
      y: 10,
      lines: [
        { text: "╭─☥─╮", color: "#ef4444", bold: true },
        { text: "│ █ │", color: "#ef4444", bold: true },
        { text: "╰───╯", color: "#991b1b", bold: true },
      ],
    },
  ],
  hotspots: [
    {
      id: "gate",
      label: "Station Entrance",
      icon: "◈",
      x: 7,
      y: 5,
      tagColor: "#38bdf8",
      messages: [
        {
          text: "The shutter to Iwatodai Station behind you is half-closed, and the ticket gates inside are completely dark.",
        },
      ],
    },
    {
      id: "vending",
      label: "Vending Machine",
      icon: "◈",
      x: 41,
      y: 5,
      tagColor: "#38bdf8",
      messages: [
        {
          text: "A drink vending machine by the wall. Even its display lights have gone out, and pushing the buttons does nothing.",
        },
      ],
    },
    {
      id: "coffin",
      label: "Strange Coffin",
      icon: "☥",
      x: 54,
      y: 9,
      tagColor: "#f87171",
      messages: [
        {
          text: "Tall, upright coffins are scattered across the station plaza where commuters should be.",
        },
        {
          text: "A faint, unsettling sound seems to echo from within the green mist...",
        },
      ],
    },
    {
      id: "strip-mall",
      label: "To Iwatodai Strip Mall",
      icon: "◀",
      x: 5,
      y: 13,
      tagColor: "#facc15",
      messages: [
        {
          text: "A gap in the construction barrier leads southwest toward Iwatodai Strip Mall and the student dormitory.",
        },
        {
          speaker: "Thought",
          text: "I should head through the strip mall to reach Iwatodai Dorm.",
        },
      ],
    },
  ],
};

export const LOCATIONS: Record<LocationId, LocationConfig> = {
  "iwatodai-station": IWATODAI_STATION,
};
