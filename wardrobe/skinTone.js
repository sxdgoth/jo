// skinTone.js

class SkinToneManager {
    constructor() {
        this.skinTones = [
            { name: 'Light', color: '#FFD5B8' },
            { name: 'Medium', color: '#E5B887' },
            { name: 'Tan', color: '#C68642' },
            { name: 'Dark', color: '#8D5524' }
        ];
        this.currentSkinTone = this.skinTones[0].color; // Default to light skin tone
    }

    initialize() {
        this.createSkinToneButtons();
        this.applySkinTone(this.currentSkinTone);
    }

    createSkinToneButtons() {
        const container = document.createElement('div');
        container.id = 'skin-tone-buttons';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.marginBottom = '10px';

        this.skinTones.forEach(tone => {
            const button = document.createElement('button');
            button.style.width = '30px';
            button.style.height = '30px';
            button.style.backgroundColor = tone.color;
            button.style.margin = '0 5px';
            button.style.border = 'none';
            button.style.borderRadius = '50%';
            button.style.cursor = 'pointer';
            button.title = tone.name;
            button.onclick = () => this.applySkinTone(tone.color);
            container.appendChild(button);
        });

        const avatarDisplay = document.getElementById('avatar-display');
        avatarDisplay.parentNode.insertBefore(container, avatarDisplay);
    }

    applySkinTone(color) {
        this.currentSkinTone = color;
        const baseParts = ['Head', 'Body', 'Arms', 'Legs'];
        baseParts.forEach(part => {
            const element = document.querySelector(`#avatar-display img[data-type="${part}"]`);
            if (element) {
                this.applySkinToneFilter(element, color);
            }
        });
    }

    applySkinToneFilter(element, color) {
        const rgb = this.hexToRgb(color);
        element.style.filter = `brightness(0) saturate(100%) invert(${rgb.r / 255}) sepia(${rgb.g / 255}) saturate(${rgb.b / 255}) hue-rotate(0deg)`;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
}

// Initialize the SkinToneManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.skinToneManager = new SkinToneManager();
    window.skinToneManager.initialize();
});
