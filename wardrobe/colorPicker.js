class ColorPicker {
    constructor() {
        this.defaultEyeColors = ['#346799', '#325880', '#3676b2', '#3c93e5', '#3fa2ff'];
        this.currentEyeColor = '#000000'; // Default to black
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
            const colors = ['#000000', '#800080', '#FF0000', '#808080', '#008000', '#0000FF', '#FFA500'];
            colors.forEach(color => {
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
        if (window.avatarDisplay) {
            window.avatarDisplay.updateEyeColor(this.currentEyeColor);
        }
    }
}

// Initialize the ColorPicker when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.colorPicker = new ColorPicker();
});
