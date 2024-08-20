class EyeColorChanger {
    constructor() {
        this.colors = {
            default: '#3FA2FF',
            red: '#FF0000',
            green: '#00FF00',
            blue: '#0000FF',
            yellow: '#FFFF00'
        };
        this.setupColorButtons();
    }

    setupColorButtons() {
        const container = document.getElementById('eye-color-buttons');
        if (!container) {
            console.error("Eye color buttons container not found");
            return;
        }

        Object.entries(this.colors).forEach(([name, color]) => {
            const button = document.createElement('button');
            button.textContent = name.charAt(0).toUpperCase() + name.slice(1);
            button.style.backgroundColor = color;
            button.onclick = () => this.changeEyeColor(color);
            container.appendChild(button);
        });
    }

    changeEyeColor(color) {
        if (window.avatarManager) {
            window.avatarManager.changeEyeColor(color);
        } else {
            console.error('AvatarManager not initialized');
        }
    }
}

// Initialize the EyeColorChanger when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.eyeColorChanger = new EyeColorChanger();
});
