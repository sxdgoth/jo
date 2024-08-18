// avatarManager.js

class AvatarManager {
    constructor() {
        this.avatarDisplay = new AvatarDisplay('avatar-display');
        this.equippedItems = {};
    }

    initialize() {
        this.loadEquippedItems();
        this.updateAvatarDisplay();
    }

    loadEquippedItems() {
        const savedItems = localStorage.getItem('equippedItems');
        this.equippedItems = savedItems ? JSON.parse(savedItems) : {};
    }

    updateAvatarDisplay() {
        this.avatarDisplay.loadAvatar(this.equippedItems);
    }

    tryOnItem(item) {
        this.equippedItems[item.type] = item.id;
        this.updateAvatarDisplay();
    }

    removeItem(type) {
        delete this.equippedItems[type];
        this.updateAvatarDisplay();
    }

    resetDisplay() {
        this.equippedItems = {};
        this.updateAvatarDisplay();
    }
}

// Initialize the AvatarManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing AvatarManager");
    window.avatarManager = new AvatarManager();
    window.avatarManager.initialize();
});
