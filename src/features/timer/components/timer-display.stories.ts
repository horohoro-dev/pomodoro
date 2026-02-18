import type { Meta, StoryObj } from "@storybook/react";
import { TimerDisplay } from "./timer-display";

const meta = {
  title: "Timer/TimerDisplay",
  component: TimerDisplay,
  parameters: { layout: "centered" },
} satisfies Meta<typeof TimerDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WorkPhase: Story = {
  args: {
    state: {
      status: "running",
      currentSectionIndex: 0,
      currentPhase: "work",
      remainingTimeSec: 1500,
      totalTimeSec: 1500,
      currentLoop: 1,
    },
    totalSections: 4,
  },
};

export const BreakPhase: Story = {
  args: {
    state: {
      status: "running",
      currentSectionIndex: 0,
      currentPhase: "break",
      remainingTimeSec: 180,
      totalTimeSec: 300,
      currentLoop: 1,
    },
    totalSections: 4,
  },
};

export const LongBreakPhase: Story = {
  args: {
    state: {
      status: "running",
      currentSectionIndex: 3,
      currentPhase: "longBreak",
      remainingTimeSec: 900,
      totalTimeSec: 900,
      currentLoop: 1,
    },
    totalSections: 4,
  },
};

export const Idle: Story = {
  args: {
    state: {
      status: "idle",
      currentSectionIndex: 0,
      currentPhase: "work",
      remainingTimeSec: 1500,
      totalTimeSec: 1500,
      currentLoop: 1,
    },
    totalSections: 4,
  },
};
