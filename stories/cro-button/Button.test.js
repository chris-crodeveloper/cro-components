import "./Button"; // Import the custom button element

describe("Button component", () => {
  let button;

  beforeEach(() => {
    // Create the button element before each test
    button = document.createElement("cro-button");
    document.body.appendChild(button);
  });

  afterEach(() => {
    // Clean up the DOM after each test
    document.body.innerHTML = "";
  });

  it("should render with default label 'Click Me'", () => {
    // Check if the default label is rendered correctly
    const span = button.shadowRoot.querySelector("span");
    expect(span.textContent).toBe("Click Me");
  });

  it("should apply 'secondary' class when type is 'secondary'", () => {
    // Set the "type" attribute to "secondary"
    button.setAttribute("type", "secondary");

    // Trigger attribute change handling
    const buttonElement = button.shadowRoot.querySelector("button");
    expect(buttonElement.classList.contains("secondary")).toBe(true);
  });

  it("should dispatch 'button-click' event when clicked", () => {
    // Create a mock function to listen for the "button-click" event
    const handleClick = jest.fn();
    button.addEventListener("button-click", handleClick);

    // Simulate a click event
    const buttonElement = button.shadowRoot.querySelector("button");
    buttonElement.click();

    // Check if the "button-click" event was dispatched
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
