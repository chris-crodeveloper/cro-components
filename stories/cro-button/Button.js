//import './button.css';

class Button extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <button class='${this.getAttribute('type') || ''}'>
                <span>${this.getAttribute('label') || 'Click Me'}</span>
            </button>
        `;


        const style = document.createElement('style');
        style.textContent = `
            button {
                border: 2px solid #5F2878;
                background-color: #5F2878;
                color: white;
                //font-family: VMCircularChatPTT,Arial,Helvetica,"sans-serif";
                font-family: "VMMomentum", Arial, Helvetica, sans-serif;
                height: 48px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 32px;
                min-width: 128px;
                width: 100%;
                max-width: 250px;
                cursor: pointer;
            }
            button.secondary {
                background-color: white;
                color: #5F2878;
            }
        `;


        // Append children to shadow DOM
        this.shadowRoot.append(style);

        // Add click handler
        this.shadowRoot.querySelector('button').addEventListener('click', () => this.handleClick());

        
    }

    handleClick() {
        console.log('Button clicked!');
        this.dispatchEvent(new Event('button-click', { bubbles: true, composed: true }));
    }

    static get observedAttributes() {
        return ['label', 'disabled', 'type'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const button = this.shadowRoot.querySelector('button');
        if (name === 'label' && button) {
            button.textContent = newValue;
        }
      
        if (name === 'type') {
           button.classList = newValue;
        }
        
    }



}

// Define component if not already defined
customElements.define('cro-button', Button);





