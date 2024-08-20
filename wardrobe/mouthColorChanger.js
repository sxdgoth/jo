class LipColorChanger {
    constructor() {
        this.colors = {
            default: '#dea296',
            red: '#FF0000',
            pink: '#FFC0CB',
            coral: '#FF7F50',
            brown: '#8B4513'
        };
        this.setupColorButtons();
    }

    setupColorButtons() {
        const container = document.getElementById('lip-color-buttons');
        if (!container) {
            console.error("Lip color buttons container not found");
            return;
        }

        Object.entries(this.colors).forEach(([name, color]) => {
            const button = document.createElement('button');
            button.textContent = name.charAt(0).toUpperCase() + name.slice(1);
            button.style.backgroundColor = color;
            button.onclick = () => this.changeLipColor(color);
            container.appendChild(button);
        });
    }

    changeLipColor(color) {
        if (window.avatarManager) {
            window.avatarManager.changeLipColor(color);
        } else {
            console.error('AvatarManager not initialized');
        }
    }
}

// Initialize the LipColorChanger when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.lipColorChanger = new LipColorChanger();
});
