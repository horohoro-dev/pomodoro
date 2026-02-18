import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { SectionEditor } from "./section-editor";

const meta = {
  title: "Timer/SectionEditor",
  component: SectionEditor,
  parameters: { layout: "centered" },
  args: {
    onUpdate: fn(),
  },
} satisfies Meta<typeof SectionEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    section: { id: "s1", workDurationSec: 1500, breakDurationSec: 300 },
    index: 0,
  },
};

export const CustomDuration: Story = {
  args: {
    section: { id: "s2", workDurationSec: 2700, breakDurationSec: 600 },
    index: 1,
  },
};
