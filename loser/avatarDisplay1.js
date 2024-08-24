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
            this.avatarManager = new AvatarManager(this.currentUser.username);
            this.avatarManager.initialize();
            this.updateDisplay();
        } else {
            console.error('No user logged in');
            this.displayContainer.innerHTML = '<p>Please log in to view your avatar.</p>';
        }
    }

    getCurrentUser() {
        const userJson = sessionStorage.getItem('loggedInUser');
        return userJson ? JSON.parse(userJson) : null;
    }

    updateDisplay() {
        console.log('Updating display');
        if (!this.currentUser) {
            console.error('No current user, cannot update display');
            return;
        }

        this.displayContainer.innerHTML = ''; // Clear previous content

        // Apply skin tone
        this.avatarManager.applySkinTone();

        // Apply equipped items
        Object.entries(this.avatarManager.equippedItems).forEach(([type, itemId]) => {
            if (itemId) {
                const item = window.shopItems.find(i => i.id === itemId);
                if (item) {
                    console.log(`Applying item: ${type} - ${item.name}`);
                    this.avatarManager.updateLayerWithSkinTone(type, `https://sxdgoth.github.io/jo/${item.path}${item.id}`);
                }
            }
        });

        // Create a list of applied items
        const appliedItemsList = document.createElement('ul');
        appliedItemsList.innerHTML = '<h3>Applied Items:</h3>';
        Object.entries(this.avatarManager.equippedItems).forEach(([type, itemId]) => {
            if (itemId) {
                const item = window.shopItems.find(i => i.id === itemId);
                if (item) {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${type}: ${item.name}`;
                    appliedItemsList.appendChild(listItem);
                }
            }
        });
        this.displayContainer.appendChild(appliedItemsList);

        // Display skin tone, eye color, and lip color
        const colorInfo = document.createElement('div');
        colorInfo.innerHTML = `
            <p>Skin Tone: ${this.avatarManager.skinTone}</p>
            <p>Eye Color: ${this.avatarManager.eyeColor}</p>
            <p>Lip Color: ${this.avatarManager.lipColor}</p>
        `;
        this.displayContainer.appendChild(colorInfo);
    }
}

// Initialize the AvatarDisplay when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing AvatarDisplay');
    window.avatarDisplay = new AvatarDisplay();
    window.avatarDisplay.initialize();
});
