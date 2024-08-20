class ColorPicker {
    constructor() {
        this.defaultEyeColors = ['#346799', '#325880', '#3676b2', '#3c93e5', '#3fa2ff'];
        this.currentEyeColor = '#000000'; // Default to black
        this.eyeColors = ['#000000', '#800080', '#FF0000', '#808080', '#008000', '#0000FF', '#FFA500'];
        this.initialize();
    }

    initialize() {
        this.setupColorButtons();
        this.setupCustomColorInput();
    }

    setupColorButtons() {
        const eyeColorButtons = document.getElementById('eye-color-buttons');
        if (eyeColorButtons) {
            eyeColorButtons.innerHTML = ''; // Clear existing buttons
            this.eyeColors.forEach(color => {
                const button = document.createElement('button');
                button.className = 'color-button';
                button.style.backgroundColor = color;
                button.style.width = '30px';
                button.style.height = '30px';
                button.style.margin = '5px';
                button.style.border = '1px solid #000';
                button.style.borderRadius = '50%';
                button.style.cursor = 'pointer';
                button.onclick = () => this.changeEyeColor(color);
                eyeColorButtons.appendChild(button);
            });
        } else {
            console.error('Eye color buttons container not found');
        }
    }

    setupCustomColorInput() {
        const customColorInput = document.getElementById('custom-eye-color');
        if (customColorInput) {
            customColorInput.oninput = (e) => this.changeEyeColor(e.target.value);
        } else {
            console.error('Custom color input not found');
        }
    }

    changeEyeColor(color) {
        this.currentEyeColor = color;
        this.applyEyeColor();
    }

    applyEyeColor() {
        const eyesLayer = document.querySelector('object[data-type="Eyes"]');
        if (eyesLayer && eyesLayer.contentDocument) {
            this.updateEyeColorInSVG(eyesLayer.contentDocument);
        } else {
            console.error('Eyes layer not found or not loaded');
        }
    }

    updateEyeColorInSVG(svgDoc) {
        const eyeElements = svgDoc.querySelectorAll('path, circle, ellipse');
        eyeElements.forEach(element => {
            this.defaultEyeColors.forEach(oldColor => {
                if (element.getAttribute('fill') === oldColor) {
                    element.setAttribute('fill', this.currentEyeColor);
                }
                if (element.getAttribute('stroke') === oldColor) {
                    element.setAttribute('stroke', this.currentEyeColor);
                }
                let style = element.getAttribute('style');
                if (style) {
                    style = style.replace(new RegExp(`fill:\\s*${oldColor}`, 'gi'), `fill: ${this.currentEyeColor}`);
                    style = style.replace(new RegExp(`stroke:\\s*${oldColor}`, 'gi'), `stroke: ${this.currentEyeColor}`);
                    element.setAttribute('style', style);
                }
            });
        });

        // Force a redraw of the SVG
        const parent = svgDoc.documentElement.parentNode;
        const nextSibling = svgDoc.documentElement.nextSibling;
        parent.removeChild(svgDoc.documentElement);
        parent.insertBefore(svgDoc.documentElement, nextSibling);
    }
}

// Initialize the ColorPicker when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.colorPicker = new ColorPicker();
});
