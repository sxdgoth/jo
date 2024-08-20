class ColorPicker {
    constructor() {
        this.defaultColors = {
            eyes: ['#346799', '#325880', '#3676b2', '#3c93e5', '#3fa2ff'],
            // Add other item types and their default colors here
        };
        this.currentColors = {};
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

        for (const [itemType, colors] of Object.entries(this.defaultColors)) {
            const pickerDiv = document.createElement('div');
            pickerDiv.innerHTML = `
                <h3>${itemType.charAt(0).toUpperCase() + itemType.slice(1)} Color</h3>
                <input type="color" id="${itemType}-color-picker" value="${colors[0]}">
            `;
            colorPickerContainer.appendChild(pickerDiv);

            const colorPicker = document.getElementById(`${itemType}-color-picker`);
            colorPicker.addEventListener('input', (e) => this.changeColor(itemType, e.target.value));
        }
    }

    changeColor(itemType, newColor) {
        this.currentColors[itemType] = newColor;
        this.applyColor(itemType);
    }

    applyColor(itemType) {
        const svgObjects = document.querySelectorAll(`object[data-type="${itemType}"]`);
        svgObjects.forEach(obj => {
            if (obj.contentDocument) {
                this.updateColorInSVG(obj.contentDocument, itemType);
            }
        });
    }

    updateColorInSVG(svgDoc, itemType) {
        const newColor = this.currentColors[itemType];
        const defaultColors = this.defaultColors[itemType];

        defaultColors.forEach(oldColor => {
            const elements = svgDoc.querySelectorAll(`[fill="${oldColor}"], [stroke="${oldColor}"]`);
            elements.forEach(element => {
                if (element.getAttribute('fill') === oldColor) {
                    element.setAttribute('fill', newColor);
                }
                if (element.getAttribute('stroke') === oldColor) {
                    element.setAttribute('stroke', newColor);
                }
            });

            const styledElements = svgDoc.querySelectorAll('*');
            styledElements.forEach(element => {
                let style = element.getAttribute('style');
                if (style) {
                    style = style.replace(new RegExp(`fill:\\s*${oldColor}`, 'gi'), `fill: ${newColor}`);
                    style = style.replace(new RegExp(`stroke:\\s*${oldColor}`, 'gi'), `stroke: ${newColor}`);
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
