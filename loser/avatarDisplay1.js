// avatarDisplay.js

class AvatarDisplay {
    constructor(avatarManager) {
        this.avatarManager = avatarManager;
        this.displayContainer = document.getElementById('avatar-display-container');
    }

    initialize() {
        this.createDisplayElements();
        this.updateDisplay();
    }

    createDisplayElements() {
        this.displayContainer.innerHTML = `
            <div id="avatar-image"></div>
            <div id="avatar-details">
                <p id="skin-tone-display"></p>
                <p id="eye-color-display"></p>
                <p id="lip-color-display"></p>
                <p id="hair-color-display"></p>
                <h3>Applied Items:</h3>
                <ul id="applied-items-list"></ul>
            </div>
        `;
    }

    updateDisplay() {
        this.updateAvatarImage();
        this.updateSkinTone();
        this.updateEyeColor();
        this.updateLipColor();
        this.updateHairColor();
        this.updateAppliedItems();
    }

    updateAvatarImage() {
        const avatarImage = document.getElementById('avatar-image');
        // You'll need to implement a method to generate or retrieve the avatar image URL
        avatarImage.style.backgroundImage = `url(${this.getAvatarImageUrl()})`;
    }

    updateSkinTone() {
        const skinToneDisplay = document.getElementById('skin-tone-display');
        skinToneDisplay.textContent = `Skin Tone: ${this.avatarManager.skinTone}`;
    }

    updateEyeColor() {
        const eyeColorDisplay = document.getElementById('eye-color-display');
        eyeColorDisplay.textContent = `Eye Color: ${this.avatarManager.eyeColor}`;
        eyeColorDisplay.style.backgroundColor = this.avatarManager.eyeColor;
    }

    updateLipColor() {
        const lipColorDisplay = document.getElementById('lip-color-display');
        lipColorDisplay.textContent = `Lip Color: ${this.avatarManager.lipColor}`;
        lipColorDisplay.style.backgroundColor = this.avatarManager.lipColor;
    }

    updateHairColor() {
        const hairColorDisplay = document.getElementById('hair-color-display');
        if (this.avatarManager.hairColorChanger) {
            hairColorDisplay.textContent = `Hair Color: ${this.avatarManager.hairColorChanger.hairColor}`;
            hairColorDisplay.style.backgroundColor = this.avatarManager.hairColorChanger.hairColor;
        } else {
            hairColorDisplay.textContent = 'Hair Color: Not set';
        }
    }

    updateAppliedItems() {
        const appliedItemsList = document.getElementById('applied-items-list');
        appliedItemsList.innerHTML = '';
        Object.entries(this.avatarManager.equippedItems).forEach(([type, itemId]) => {
            const item = window.userInventory.getItems().find(i => i.id === itemId);
            if (item) {
                const listItem = document.createElement('li');
                listItem.textContent = `${type}: ${item.name}`;
                appliedItemsList.appendChild(listItem);
            }
        });
    }

    getAvatarImageUrl() {
        // Implement this method to generate or retrieve the avatar image URL
        // This might involve combining all the layers of the avatar
        // For now, we'll return a placeholder
        return 'path/to/avatar/image.png';
    }
}

// Initialize the AvatarDisplay when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.avatarManager) {
        window.avatarDisplay = new AvatarDisplay(window.avatarManager);
        window.avatarDisplay.initialize();
    } else {
        console.error('Avatar manager not initialized');
    }
});
