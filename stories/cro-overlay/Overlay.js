//import './button.css';



class Overlay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <div id='${this.getAttribute('overlayId') || ''}' class='cro-fullscreen-overlay'>
            <div class='cro-fullscreen-overlay--container'>
                <span class='cro-fullscreen-overlay--overlay-close'>
                    <img alt="times" src="//cdn.optimizely.com/img/22744560884/bfe392b17044466786e01eddb7f09850.png" />
                </span>
                <div class='cro-fullscreen-overlay--header'>
                    ${this.getAttribute('header') || ''}
                </div>
                <div class='cro-fullscreen-overlay--body'>
                    ${this.getAttribute('body') || ''}
                </div>
                <div class='cro-fullscreen-overlay--footer'>
                    ${this.getAttribute('footer') || ''}
                </div>
            </div>
        </div>
        `
        const style = document.createElement('style');
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
                    font-family: vm.$chat;
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

        // Append children to shadow DOM
        this.shadowRoot.append(style);


        // Add event listener to the close button
        const closeButton = this.shadowRoot.querySelector('.cro-fullscreen-overlay--overlay-close');
        closeButton.addEventListener('click', this.handleCloseButtonClick.bind(this));
    }

    static get observedAttributes() {
        return ['overlayId', 'header', 'body', 'footer'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const header = this.shadowRoot.querySelector('.cro-fullscreen-overlay--header');
        const body = this.shadowRoot.querySelector('.cro-fullscreen-overlay--body');
        const footer = this.shadowRoot.querySelector('.cro-fullscreen-overlay--footer');
       
        if (name === 'overlayId' && button) {
            button.textContent = newValue;
        }
      
        if (name === 'header' && header) {
            header.innerHTML = newValue;
        }

        if (name === 'body' && body) {
            body.innerHTML = newValue;
         }

         if (name === 'footer' && footer) {
            footer.innerHTML = newValue;
         }
        
    }

    handleCloseButtonClick() {
        const htmlTag = document.querySelector(`html`);
        
        const overlay = this.shadowRoot.querySelector('.cro-fullscreen-overlay');
        overlay.className = overlay.className.includes('cro-fullscreen-overlay--active') ? '' : 'cro-fullscreen-overlay--active';
        overlay.className = overlay.className.includes('cro-fullscreen-overlay--hide') ? '' : 'cro-fullscreen-overlay--hide';

        // Handle the click event here
        console.log('Close button clicked!');
        // You can perform any desired action, such as removing the overlay.
    }
}


// Define component if not already defined
customElements.define('cro-overlay', Overlay);



