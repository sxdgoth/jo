class ColorPicker {
    constructor() {
        this.eyeColors = ['#346799', '#325880', '#3676b2', '#3c93e5', '#3fa2ff'];
        this.currentEyeColor = '#3fa2ff'; // Default eye color
        this.initialize();
    }

    initialize() {
        this.setupColorButtons();
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

    changeEyeColor(color) {
        this.currentEyeColor = color;
        this.applyEyeColor();
    }

    applyEyeColor() {
        const eyesLayer = document.querySelector('object[data-type="Eyes"]');
        if (eyesLayer && eyesLayer.contentDocument) {
            this.updateEyeColorInSVG(eyesLayer.contentDocument, this.currentEyeColor);
        } else {
            console.error('Eyes layer not found or not loaded');
        }
    }

    updateEyeColorInSVG(svgDoc, newColor) {
        const eyeElements = svgDoc.querySelectorAll('path, circle, ellipse');
        eyeElements.forEach(element => {
            this.eyeColors.forEach(oldColor => {
                if (element.getAttribute('fill') === oldColor) {
                    element.setAttribute('fill', newColor);
                }
                if (element.getAttribute('stroke') === oldColor) {
                    element.setAttribute('stroke', newColor);
                }
                let style = element.getAttribute('style');
                if (style) {
                    style = style.replace(new RegExp(`fill:\\s*${oldColor}`, 'gi'), `fill: ${newColor}`);
                    style = style.replace(new RegExp(`stroke:\\s*${oldColor}`, 'gi'), `stroke: ${newColor}`);
                    element.setAttribute('style', style);
                }
            });
        });
    }
}

// Initialize the ColorPicker when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.colorPicker = new ColorPicker();
});
