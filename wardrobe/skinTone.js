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
        const container = document.createElement('div');
        container.id = 'skin-tone-buttons';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.marginTop = '10px';

        this.skinTones.forEach(tone => {
            const button = document.createElement('button');
            button.className = 'skin-tone-button';
            button.style.width = '30px';
            button.style.height = '30px';
            button.style.backgroundColor = tone.color;
            button.style.margin = '0 5px';
            button.style.border = '2px solid #000';
            button.style.borderRadius = '50%';
            button.style.cursor = 'pointer';
            button.title = tone.name;
            button.onclick = () => this.selectSkinTone(tone.color);
            container.appendChild(button);
        });

        const avatarDisplay = document.getElementById('avatar-display');
        if (avatarDisplay && avatarDisplay.parentNode) {
            avatarDisplay.parentNode.insertBefore(container, avatarDisplay.nextSibling);
        } else {
            console.error('Avatar display element not found');
        }
    }

    selectSkinTone(color) {
        this.currentSkinTone = color;
        console.log(`Selected skin tone: ${color}`);
        
        // Update button styles
        const buttons = document.querySelectorAll('.skin-tone-button');
        buttons.forEach(button => {
            if (button.style.backgroundColor === color) {
                button.style.borderColor = '#ff4500';
                button.style.boxShadow = '0 0 5px #ff4500';
            } else {
                button.style.borderColor = '#000';
                button.style.boxShadow = 'none';
            }
        });

        // Apply skin tone to avatar
        this.applySkinTone(color);
    }

    applySkinTone(color) {
        if (window.avatarDisplay && window.avatarDisplay.layers) {
            const baseParts = ['Head', 'Body', 'Arms', 'Legs'];
            baseParts.forEach(part => {
                const layer = window.avatarDisplay.layers[part];
                if (layer && layer.contentDocument) {
                    this.applySkinToneToSVG(layer.contentDocument, color);
                }
            });
        } else {
            console.error('Avatar display or layers not found');
        }
    }

    applySkinToneToSVG(svgDoc, color) {
        const paths = svgDoc.querySelectorAll('path, circle, ellipse, rect');
        paths.forEach(path => {
            if (path.getAttribute('fill') && path.getAttribute('fill') !== 'none') {
                path.setAttribute('fill', color);
            }
        });
    }
}

// Initialize the SkinToneManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.skinToneManager = new SkinToneManager();
    window.skinToneManager.initialize();
});
