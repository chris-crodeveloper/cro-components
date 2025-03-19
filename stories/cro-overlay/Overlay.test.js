import "./Overlay"; // Import the overlay component

// Set up a mock for the close button image URL, or use a real URL if desired
//const mockCloseImgUrl = "//cdn.optimizely.com/img/22744560884/bfe392b17044466786e01eddb7f09850.png";

describe("Overlay Component", () => {
  let overlay;

  beforeEach(() => {
    // Create a new overlay element before each test
    overlay = document.createElement("cro-overlay");
    document.body.appendChild(overlay);
  });

  afterEach(() => {
    // Clean up after each test
    document.body.removeChild(overlay);
  });

  it("should render with default attributes", () => {
    const overlayElement = overlay.shadowRoot.querySelector(
      ".cro-fullscreen-overlay"
    );

    // Check if overlay is hidden initially
    expect(overlayElement).toHaveClass("cro-fullscreen-overlay--hide");
    expect(overlayElement).toHaveAttribute("aria-hidden", "true");

    const header = overlay.shadowRoot.querySelector(
      ".cro-fullscreen-overlay--header"
    );
    const body = overlay.shadowRoot.querySelector(
      ".cro-fullscreen-overlay--body"
    );
    const footer = overlay.shadowRoot.querySelector(
      ".cro-fullscreen-overlay--footer"
    );

    // Check default text content
    expect(header.textContent.trim()).toBe("Default Header");
    expect(body.textContent.trim()).toBe("Default Body Content");
    expect(footer.textContent.trim()).toBe("Default Footer");
  });

  it("should update attributes correctly", () => {
    overlay.setAttribute("header", "Updated Header");
    overlay.setAttribute("body", "Updated Body");
    overlay.setAttribute("footer", "Updated Footer");

    const header = overlay.shadowRoot.querySelector(
      ".cro-fullscreen-overlay--header"
    );
    const body = overlay.shadowRoot.querySelector(
      ".cro-fullscreen-overlay--body"
    );
    const footer = overlay.shadowRoot.querySelector(
      ".cro-fullscreen-overlay--footer"
    );

    // Check if updated content is reflected correctly
    expect(header.textContent).toBe("Updated Header");
    expect(body.textContent).toBe("Updated Body");
    expect(footer.textContent).toBe("Updated Footer");
  });

  it("should toggle overlay visibility when close button is clicked", () => {
    const overlayElement = overlay.shadowRoot.querySelector(
      ".cro-fullscreen-overlay"
    );
    const closeButton = overlay.shadowRoot.querySelector(
      ".cro-fullscreen-overlay--overlay-close"
    );

    // Initially, the overlay should be hidden
    expect(overlayElement).toHaveClass("cro-fullscreen-overlay--hide");
    expect(overlayElement).toHaveAttribute("aria-hidden", "true");

    // Simulate a click on the close button to show the overlay
    closeButton.click();

    // After clicking, the overlay should be visible
    expect(overlayElement).not.toHaveClass("cro-fullscreen-overlay--hide");
    expect(overlayElement).toHaveClass("cro-fullscreen-overlay--active");
    expect(overlayElement).toHaveAttribute("aria-hidden", "false");

    // Simulate another click on the close button to hide the overlay
    closeButton.click();

    // After clicking again, the overlay should be hidden again
    expect(overlayElement).toHaveClass("cro-fullscreen-overlay--hide");
    expect(overlayElement).toHaveAttribute("aria-hidden", "true");
  });

  it("should correctly toggle aria-hidden attribute when overlay visibility changes", () => {
    const overlayElement = overlay.shadowRoot.querySelector(
      ".cro-fullscreen-overlay"
    );
    const closeButton = overlay.shadowRoot.querySelector(
      ".cro-fullscreen-overlay--overlay-close"
    );

    // Initially, the overlay should have aria-hidden='true'
    expect(overlayElement).toHaveAttribute("aria-hidden", "true");

    // Click to show the overlay
    closeButton.click();

    // Now it should have aria-hidden='false'
    expect(overlayElement).toHaveAttribute("aria-hidden", "false");

    // Click again to hide the overlay
    closeButton.click();

    // It should return to aria-hidden='true'
    expect(overlayElement).toHaveAttribute("aria-hidden", "true");
  });

  //   it('should reflect the overlayId attribute', () => {
  //     const overlayId = 'test-overlay-id';
  //     overlay.setAttribute('overlayId', overlayId);

  //     // Check if the id attribute is correctly set
  //     const overlayElement = overlay.shadowRoot.querySelector('.cro-fullscreen-overlay');
  //     expect(overlayElement.id).toBe(overlayId);
  // //   });

  //   it('should call handleCloseButtonClick when the close button is clicked', () => {
  //     const closeButton = overlay.shadowRoot.querySelector('.cro-fullscreen-overlay--overlay-close');
  //     const spy = jest.spyOn(overlay, 'handleCloseButtonClick');

  //     // Simulate a click on the close button
  //     closeButton.click();

  //     // Check if handleCloseButtonClick was called
  //     expect(spy).toHaveBeenCalled();
  //   });
});
