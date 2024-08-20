class ColorPicker {
    constructor() {
        this.colors = {
            eyes: '#3FA2FF', // Default eye color
            // Add more default colors for other items as needed
        };
        this.initialize();
    }

    initialize() {
        this.setupColorButtons();
    }

    setupColorButtons() {
        const eyeColorButtons = document.querySelectorAll('#eye-color-buttons .color-button');
        eyeColorButtons.forEach(button => {
            const color = button.dataset.color;
            button.style.backgroundColor = color;
            button.onclick = () => this.changeColor('eyes', color);
        });
        // Add more color button setups for other items as needed
    }

    changeColor(itemType, color) {
        this.colors[itemType] = color;
        this.applyColors();
    }

    applyColors() {
        if (window.avatarManager) {
            window.avatarManager.updateItemColors(this.colors);
        }
    }
}

// Initialize the ColorPicker when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.colorPicker = new ColorPicker();
});
