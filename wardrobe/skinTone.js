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
    }

    createSkinToneButtons() {
        const container = document.getElementById('skin-tone-buttons');
        if (!container) {
            console.error('Skin tone buttons container not found');
            return;
        }

        this.skinTones.forEach(tone => {
            const button = document.createElement('button');
            button.style.width = '50px';
            button.style.height = '50px';
            button.style.backgroundColor = tone.color;
            button.style.margin = '0 5px';
            button.style.border = '2px solid #000';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';
            button.title = tone.name;
            button.onclick = () => this.selectSkinTone(tone.color);
            container.appendChild(button);
        });
    }

    selectSkinTone(color) {
        this.currentSkinTone = color;
        console.log(`Selected skin tone: ${color}`);
        // You can add more logic here to apply the skin tone or save it
    }
}

// Initialize the SkinToneManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.skinToneManager = new SkinToneManager();
    window.skinToneManager.initialize();
});
