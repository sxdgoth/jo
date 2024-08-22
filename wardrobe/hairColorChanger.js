// hairColorChanger.js

class HairColorChanger {
    constructor() {
        this.colors = {
            default: '#1E1E1E',
            brown: '#323232',
            darkGray: '#464646',
            gray: '#5A5A5A',
            lightGray: '#787878',
            custom: '#1E1E1E'  // This will be updated when a custom color is chosen
        };
        this.hairTones = ['#1E1E1E', '#323232', '#464646', '#5A5A5A', '#1E1E1E', '#787878'];
        this.setupColorButtons();
        this.setupCustomColorPicker();
    }

    setupColorButtons() {
        const container = document.getElementById('hair-color-buttons');
        if (!container) {
            console.error("Hair color buttons container not found");
            return;
        }

        Object.entries(this.colors).forEach(([name, color]) => {
            const button = document.createElement('button');
            button.textContent = name.charAt(0).toUpperCase() + name.slice(1);
            button.style.backgroundColor = color;
            button.onclick = () => this.changeHairColor(color);
            container.appendChild(button);
        });
    }

    setupCustomColorPicker() {
        const picker = document.getElementById('hair-color-picker');
        if (!picker) {
            console.error("Hair color picker not found");
            return;
        }

        picker.addEventListener('input', (event) => {
            const color = event.target.value;
            this.colors.custom = color;
            this.changeHairColor(color);
        });
    }

    changeHairColor(color) {
        if (window.avatarManager) {
            this.hairTones = this.hairTones.map(() => color);
            window.avatarManager.changeHairColor(this.hairTones);
        } else {
            console.error('AvatarManager not initialized');
        }
    }
}

// Initialize the HairColorChanger when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.hairColorChanger = new HairColorChanger();
});
