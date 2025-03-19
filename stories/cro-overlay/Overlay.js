class Overlay extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <div id="${this.getAttribute("overlayId") || "default-overlay"}" class="cro-fullscreen-overlay cro-fullscreen-overlay--hide" role="dialog" aria-labelledby="overlay-header" aria-hidden="true">
        <div class="cro-fullscreen-overlay--container">
          <span class="cro-fullscreen-overlay--overlay-close" role="button" aria-label="Close Overlay">
            <img alt="close" src="//cdn.optimizely.com/img/22744560884/bfe392b17044466786e01eddb7f09850.png" />
          </span>
          <div id="overlay-header" class="cro-fullscreen-overlay--header">
            ${this.getAttribute("header") || "Default Header"}
          </div>
          <div class="cro-fullscreen-overlay--body">
            ${this.getAttribute("body") || "Default Body Content"}
          </div>
          <div class="cro-fullscreen-overlay--footer">
            ${this.getAttribute("footer") || "Default Footer"}
          </div>
        </div>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      .cro-fullscreen-overlay--active {
        overflow: hidden;
      }

      .cro-fullscreen-overlay {
        position: fixed;
        background-color: rgba(0, 0, 0, 0.75);
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        z-index: 99999;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s, visibility 0.3s;
      }

      .cro-fullscreen-overlay--active {
        opacity: 1;
        visibility: visible;
      }

      .cro-fullscreen-overlay--hide {
        display: none;
      }

      .cro-fullscreen-overlay--container {
        height: auto;
        width: 90%;
        background-color: #fff;
        padding: 0 1.5rem 1.5rem;
        position: relative;
        border-radius: 5px;
        max-width: 51.75rem;
        overflow: auto;
      }

      .cro-fullscreen-overlay--header {
        margin: 1.5rem 1.7rem 1.2rem 0;
        padding-bottom: 1.5rem;
        font-family: "Arial", sans-serif;
        line-height: 1.5;
        border-bottom: #dbdbdb 0.0625rem solid;
      }

      .cro-fullscreen-overlay--overlay-close {
        position: absolute;
        right: 1.5rem;
        top: 1.5rem;
        cursor: pointer;
      }

      .cro-fullscreen-overlay--overlay-close img {
        width: 22px;
        font-weight: 100;
      }

      .cro-fullscreen-overlay--body {
        padding: 0.5rem 0;
      }
    `;

    this.shadowRoot.append(style);

    this.closeButton = this.shadowRoot.querySelector(".cro-fullscreen-overlay--overlay-close");
    this.overlayDiv = this.shadowRoot.querySelector(".cro-fullscreen-overlay");
    this.closeButton.addEventListener("click", this.handleCloseButtonClick.bind(this));
  }

  static get observedAttributes() {
    return ["overlayId", "header", "body", "footer"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const header = this.shadowRoot.querySelector(".cro-fullscreen-overlay--header");
    const body = this.shadowRoot.querySelector(".cro-fullscreen-overlay--body");
    const footer = this.shadowRoot.querySelector(".cro-fullscreen-overlay--footer");

    // Avoid unnecessary updates
    if (oldValue !== newValue) {
      if (name === "header" && header) header.innerHTML = newValue;
      if (name === "body" && body) body.innerHTML = newValue;
      if (name === "footer" && footer) footer.innerHTML = newValue;
    }
  }

  handleCloseButtonClick() {
    // Toggle active and hide classes with more specific logic
    this.overlayDiv.classList.toggle("cro-fullscreen-overlay--active");
    this.overlayDiv.classList.toggle("cro-fullscreen-overlay--hide");

    // Set aria-hidden attribute for accessibility
    const isVisible = this.overlayDiv.classList.contains("cro-fullscreen-overlay--active");
    this.overlayDiv.setAttribute("aria-hidden", !isVisible);
  }
}

// Define the custom element if not already defined
if (!customElements.get("cro-overlay")) {
  customElements.define("cro-overlay", Overlay);
}
