import "./Overlay";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: "CRO/Overlay",
  tags: ["autodocs"],
  argTypes: {
    overlayId: { control: "text" },
    header: { control: "text" },
    body: { control: "text" },
    footer: { control: "text" }
  },
  decorators: [
    Story => {
      const container = document.createElement("div");
      container.style.height = "500px"; // Force height
      container.appendChild(Story());
      return container;
    }
  ]
};

const Template = ({ overlayId, header, body, footer }) => {
  const croButton = document.createElement("cro-overlay");
  if (overlayId) croButton.setAttribute("overlayId", overlayId);
  if (header) croButton.setAttribute("header", header);
  if (body) croButton.setAttribute("body", body);
  if (footer) croButton.setAttribute("footer", footer);
  return croButton;
};

export const Default = Template.bind({});
Default.args = {
  overlayId: "Eli",
  header: "ELI LOVES GERKINS",
  body: "gerrrrrrkings",
  footer: "footer"
};
