// colorCustomizer.js

class ColorCustomizer {
    constructor(avatarManager) {
        this.avatarManager = avatarManager;
        this.currentItem = null;
    }

    initialize() {
        this.setupColorPicker();
    }

    setupColorPicker() {
        const colorPicker = document.getElementById('color-picker');
        const applyColorBtn = document.getElementById('apply-color-btn');

        if (colorPicker && applyColorBtn) {
            colorPicker.addEventListener('input', () => this.previewColor(colorPicker.value));
            applyColorBtn.addEventListener('click', () => this.applyColor(colorPicker.value));
        } else {
            console.error('Color picker elements not found');
        }
    }

    setCurrentItem(item) {
        this.currentItem = item;
    }

    previewColor(color) {
        if (this.currentItem && this.avatarManager) {
            this.avatarManager.previewItemColor(this.currentItem, color);
        }
    }

    applyColor(color) {
        if (this.currentItem && this.avatarManager) {
            this.avatarManager.applyItemColor(this.currentItem, color);
        }
    }
}

// Initialize the ColorCustomizer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.avatarManager) {
        window.colorCustomizer = new ColorCustomizer(window.avatarManager);
        window.colorCustomizer.initialize();
    } else {
        console.error('AvatarManager not found');
    }
});
