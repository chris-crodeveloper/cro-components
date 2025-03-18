//import './button.css';

class Header extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
            <h3>${this.getAttribute("label") || "Header"}</h3>
        `;


    const style = document.createElement("style");
    style.textContent = `
            h3 {
                font-size: 30px;
            }
        `;


    // Append children to shadow DOM
    this.shadowRoot.append(style);

        
  }

  static get observedAttributes() {
    return ["label"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const header = this.shadowRoot.querySelector("h3");
    if (name === "label" && header) {
      header.textContent = newValue;
    }
    
  }



}

// Define component if not already defined
customElements.define("cro-header", Header);





