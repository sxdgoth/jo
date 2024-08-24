// avatarDisplay.js

class AvatarDisplay {
    constructor() {
        this.displayContainer = document.getElementById('avatar-display');
        this.avatarManager = null;
        this.currentUser = null;
    }

    initialize() {
    console.log('Initializing AvatarDisplay');
    this.currentUser = this.getCurrentUser();
    if (this.currentUser) {
        console.log('Current user:', this.currentUser);
        this.loadAvatarState();
        this.createDisplayElements();
        this.updateDisplay();
    } else {
        console.error('No user logged in');
        this.displayContainer.innerHTML = '<p>Please log in to view your avatar.</p>';
    }
}

loadAvatarState() {
    const avatarState = JSON.parse(localStorage.getItem('avatarState') || '{}');
    this.avatarManager = new AvatarManager(this.currentUser.username);
    this.avatarManager.initialize(avatarState);
}

    getCurrentUser() {
        const userJson = sessionStorage.getItem('loggedInUser');
        return userJson ? JSON.parse(userJson) : null;
    }

    createDisplayElements() {
        console.log('Creating display elements');
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
            <p id="user-coins">Coins: ${this.currentUser.coins || 0}</p>
        `;
    }

    updateDisplay() {
        console.log('Updating display');
        if (!this.currentUser) {
            console.error('No current user, cannot update display');
            return;
        }

        this.updateAvatarImage();
        this.updateSkinTone();
        this.updateEyeColor();
        this.updateLipColor();
        this.updateHairColor();
        this.updateAppliedItems();
        this.updateUserCoins();
    }

    updateAvatarImage() {
        // This method should update the avatar image based on the current state
        // You may need to implement this based on how your avatar is rendered
        console.log('Updating avatar image');
        this.avatarManager.updateAvatarDisplay();
    }

    updateSkinTone() {
        const skinToneDisplay = document.getElementById('skin-tone-display');
        skinToneDisplay.textContent = `Skin Tone: ${this.avatarManager.skinTone}`;
        console.log('Updated skin tone:', this.avatarManager.skinTone);
    }

    updateEyeColor() {
        const eyeColorDisplay = document.getElementById('eye-color-display');
        eyeColorDisplay.textContent = `Eye Color: ${this.avatarManager.eyeColor}`;
        eyeColorDisplay.style.backgroundColor = this.avatarManager.eyeColor;
        console.log('Updated eye color:', this.avatarManager.eyeColor);
    }

    updateLipColor() {
        const lipColorDisplay = document.getElementById('lip-color-display');
        lipColorDisplay.textContent = `Lip Color: ${this.avatarManager.lipColor}`;
        lipColorDisplay.style.backgroundColor = this.avatarManager.lipColor;
        console.log('Updated lip color:', this.avatarManager.lipColor);
    }

    updateHairColor() {
        const hairColorDisplay = document.getElementById('hair-color-display');
        if (this.avatarManager.hairColorChanger) {
            hairColorDisplay.textContent = `Hair Color: ${this.avatarManager.hairColorChanger.hairColor}`;
            hairColorDisplay.style.backgroundColor = this.avatarManager.hairColorChanger.hairColor;
            console.log('Updated hair color:', this.avatarManager.hairColorChanger.hairColor);
        } else {
            hairColorDisplay.textContent = 'Hair Color: Not set';
            console.log('Hair color not set');
        }
    }

    updateAppliedItems() {
        console.log('Updating applied items');
        const appliedItemsList = document.getElementById('applied-items-list');
        appliedItemsList.innerHTML = '';
        const equippedItems = this.avatarManager.equippedItems;
        console.log('Equipped items:', equippedItems);

        if (Object.keys(equippedItems).length === 0) {
            console.log('No items equipped');
            appliedItemsList.innerHTML = '<li>No items equipped</li>';
            return;
        }

        Object.entries(equippedItems).forEach(([type, itemId]) => {
            console.log(`Processing item: ${type} - ${itemId}`);
            const item = window.userInventory.getItems().find(i => i.id === itemId);
            if (item) {
                const listItem = document.createElement('li');
                listItem.textContent = `${type}: ${item.name}`;
                appliedItemsList.appendChild(listItem);
                console.log(`Added item to list: ${type} - ${item.name}`);
            } else {
                console.error(`Item not found in inventory: ${type} - ${itemId}`);
            }
        });
    }

    updateUserCoins() {
        const userCoinsDisplay = document.getElementById('user-coins');
        const coins = this.currentUser.coins || 0;
        userCoinsDisplay.textContent = `Coins: ${coins}`;
        console.log('Updated user coins:', coins);
    }
}

// Initialize the AvatarDisplay when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing AvatarDisplay');
    window.avatarDisplay = new AvatarDisplay();
    window.avatarDisplay.initialize();
});
