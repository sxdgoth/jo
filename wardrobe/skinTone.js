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
            button.className = 'skin-tone-button';
            button.style.backgroundColor = tone.color;
            button.title = tone.name;
            button.onclick = () => this.selectSkinTone(tone.color);
            container.appendChild(button);
        });

        // Select the default skin tone
        this.selectSkinTone(this.currentSkinTone);
    }

    selectSkinTone(color) {
        this.currentSkinTone = color;
        console.log(`Selected skin tone: ${color}`);
        
        // Update button styles
        const buttons = document.querySelectorAll('.skin-tone-button');
        buttons.forEach(button => {
            if (button.style.backgroundColor === color) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });

        // You can add more logic here to apply the skin tone to your avatar
    }
}

// Initialize the SkinToneManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.skinToneManager = new SkinToneManager();
    window.skinToneManager.initialize();
});
