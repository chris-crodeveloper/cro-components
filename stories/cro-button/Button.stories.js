import "./Button";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: "CRO/Button",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    disabled: { control: "boolean" },
    type: { control: "text" }
  }
};

const Template = ({ label, disabled, type }) => {
  const croButton = document.createElement("cro-button");
  if (label) croButton.setAttribute("label", label);
  if (disabled) croButton.setAttribute("disabled", "");
  if (type) croButton.setAttribute("type", type);
  return croButton;
};

export const Default = Template.bind({});
Default.args = {
  label: "Click Me",
  disabled: false,
  type: "primary"
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: "Click Me Please",
  disabled: false,
  type: "secondary"
};
