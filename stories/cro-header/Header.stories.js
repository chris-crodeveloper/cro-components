import "./Header";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: "CRO/Header",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" }
  }
};

const Template = ({ label }) => {
  const croHeader = document.createElement("cro-header");
  if (label) croHeader.setAttribute("label", label);
  return croHeader;
};

export const Default = Template.bind({});
Default.args = {
  label: "Click Me"
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: "Click Me Please"
};
