import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { TimerControls } from "./timer-controls";

const meta = {
  title: "Timer/TimerControls",
  component: TimerControls,
  parameters: { layout: "centered" },
  args: {
    onStart: fn(),
    onPause: fn(),
    onReset: fn(),
    onSkip: fn(),
  },
} satisfies Meta<typeof TimerControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  args: { status: "idle" },
};

export const Running: Story = {
  args: { status: "running" },
};

export const Paused: Story = {
  args: { status: "paused" },
};
