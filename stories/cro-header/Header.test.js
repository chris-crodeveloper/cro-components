import "./Header"; // Import the component

describe("Header Component", () => {
  let header;

  beforeEach(() => {
    // Create a new instance of the component before each test
    header = document.createElement("cro-header");
    document.body.appendChild(header); // Attach it to the DOM
  });

  afterEach(() => {
    // Clean up after each test
    document.body.innerHTML = "";
  });

  it("should render with default label 'Header'", () => {
    const h3 = header.shadowRoot.querySelector("h3");
    expect(h3.textContent).toBe("Header");
  });

  it("should render with custom label when 'label' attribute is set", () => {
    header.setAttribute("label", "Custom Header");
    const h3 = header.shadowRoot.querySelector("h3");
    expect(h3.textContent).toBe("Custom Header");
  });

  it("should update the label when 'label' attribute is changed", () => {
    header.setAttribute("label", "Initial Header");
    const h3 = header.shadowRoot.querySelector("h3");
    expect(h3.textContent).toBe("Initial Header");

    // Change the label attribute
    header.setAttribute("label", "Updated Header");
    expect(h3.textContent).toBe("Updated Header");
  });

  it("should have the correct style applied to the h3 element", () => {
    const style = header.shadowRoot.querySelector("style");
    expect(style.textContent).toContain("h3 { font-size: 30px; }");
  });
});
