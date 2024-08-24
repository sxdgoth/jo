// avatarDisplay.js

class AvatarDisplay {
    constructor() {
        this.displayContainer = document.getElementById('avatar-display-container');
        this.avatarManager = null;
        this.currentUser = null;
    }

    initialize() {
        this.currentUser = UserManager.getCurrentUser();
        if (this.currentUser) {
            this.avatarManager = new AvatarManager(this.currentUser.username);
            this.avatarManager.initialize();
            this.createDisplayElements();
            this.updateDisplay();
        } else {
            console.error('No user logged in');
            this.displayContainer.innerHTML = '<p>Please log in to view your avatar.</p>';
        }
    }

    createDisplayElements() {
        this.displayContainer.innerHTML = `
            <h2>Welcome, ${this.currentUser.username}!</h2>
            <div id="avatar-image"></div>
            <div id="avatar-details">
                <p id="skin-tone-display"></p>
                <p id="eye-color-display"></p>
                <p id="lip-color-display"></p>
                <p id="hair-color-display"></p>
                <h3>Applied Items:</h3>
                <ul id="applied-items-list"></ul>
            </div>
            <p id="user-coins">Coins: ${UserManager.getUserCoins()}</p>
        `;
    }

    updateDisplay() {
        if (!this.currentUser) return;

        this.updateAvatarImage();
        this.updateSkinTone();
        this.updateEyeColor();
        this.updateLipColor();
        this.updateHairColor();
        this.updateAppliedItems();
        this.updateUserCoins();
    }

    updateAvatarImage() {
        const avatarImage = document.getElementById('avatar-image');
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

    updateUserCoins() {
        const userCoinsDisplay = document.getElementById('user-coins');
        userCoinsDisplay.textContent = `Coins: ${UserManager.getUserCoins()}`;
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
    window.avatarDisplay = new AvatarDisplay();
    window.avatarDisplay.initialize();
});
