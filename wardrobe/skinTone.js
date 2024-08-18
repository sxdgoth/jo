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
        const avatarDisplay = document.getElementById('avatar-display');
        if (!avatarDisplay) {
            console.error('Avatar display not found');
            return;
        }

        const container = document.getElementById('skin-tone-buttons');
        if (!container) {
            console.error('Skin tone buttons container not found');
            return;
        }

        // Position the container absolutely under the avatar
        container.style.position = 'absolute';
        container.style.bottom = '-50px';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';

        this.skinTones.forEach(tone => {
            const button = document.createElement('button');
            button.className = 'skin-tone-button';
            button.style.backgroundColor = tone.color;
            button.style.width = '30px';
            button.style.height = '30px';
            button.style.margin = '0 5px';
            button.style.border = '2px solid #000';
            button.style.borderRadius = '50%';
            button.style.cursor = 'pointer';
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
