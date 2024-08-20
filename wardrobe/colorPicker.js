class ColorPicker {
    constructor() {
        this.colors = {
            eyes: '#3FA2FF', // Default eye color
            // Add more default colors for other items as needed
        };
        this.eyeColors = ['#346799', '#325880', '#3676b2', '#3c93e5', '#3fa2ff'];
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
                button.onclick = () => this.changeColor('eyes', color);
                eyeColorButtons.appendChild(button);
            });
        } else {
            console.error('Eye color buttons container not found');
        }
        // Add more color button setups for other items as needed
    }

    changeColor(itemType, color) {
        this.colors[itemType] = color;
        if (window.avatarManager) {
            window.avatarManager.updateItemColors({ [itemType]: color });
        }
    }
}

// Initialize the ColorPicker when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.colorPicker = new ColorPicker();
});
