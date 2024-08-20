class ColorPicker {
    constructor() {
        this.eyeColors = {
            main: '#3FA2FF',
            skin: '#E6BBA8',
            highlight: '#FFFFFF',
            shadow: '#F4D5BF'
        };
        this.currentColors = {...this.eyeColors};
        this.initialize();
    }

    initialize() {
        this.setupColorPickers();
    }

    setupColorPickers() {
        const colorPickerContainer = document.getElementById('color-picker-container');
        if (!colorPickerContainer) {
            console.error('Color picker container not found');
            return;
        }

        for (const [colorType, color] of Object.entries(this.eyeColors)) {
            const pickerDiv = document.createElement('div');
            pickerDiv.innerHTML = `
                <label for="${colorType}-color-picker">${colorType.charAt(0).toUpperCase() + colorType.slice(1)} Color:</label>
                <input type="color" id="${colorType}-color-picker" value="${color}">
            `;
            colorPickerContainer.appendChild(pickerDiv);

            const colorPicker = document.getElementById(`${colorType}-color-picker`);
            colorPicker.addEventListener('input', (e) => this.changeColor(colorType, e.target.value));
        }
    }

    changeColor(colorType, newColor) {
        this.currentColors[colorType] = newColor;
        this.applyColors();
    }

    applyColors() {
        const eyeSVGs = document.querySelectorAll('object[data-type="eyes"]');
        eyeSVGs.forEach(svg => {
            if (svg.contentDocument) {
                this.updateColorsInSVG(svg.contentDocument);
            }
        });
    }

    updateColorsInSVG(svgDoc) {
        // Update main eye color
        const mainEyeElement = svgDoc.querySelector('path[fill="#3FA2FF"]');
        if (mainEyeElement) {
            mainEyeElement.setAttribute('fill', this.currentColors.main);
        }

        // Update skin color
        const skinElements = svgDoc.querySelectorAll('path[fill="#E6BBA8"]');
        skinElements.forEach(el => el.setAttribute('fill', this.currentColors.skin));

        // Update highlight color
        const highlightElements = svgDoc.querySelectorAll('path[fill="#FFFFFF"]');
        highlightElements.forEach(el => el.setAttribute('fill', this.currentColors.highlight));

        // Update shadow color
        const shadowElement = svgDoc.querySelector('path[fill="#F4D5BF"]');
        if (shadowElement) {
            shadowElement.setAttribute('fill', this.currentColors.shadow);
        }

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
