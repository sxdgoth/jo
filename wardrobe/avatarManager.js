class AvatarManager {
    constructor(username) {
        this.username = username;
        this.equippedItems = {};
        this.tempEquippedItems = {};
        this.skinTone = 'light'; // New line
        this.loadEquippedItems();
    }

    initialize() {
        this.setupApplyAvatarButton();
        this.setupClearAvatarButton();
        this.updateAvatarDisplay();
    }

    setupApplyAvatarButton() {
        const applyAvatarBtn = document.getElementById('apply-avatar-btn');
        if (applyAvatarBtn) {
            applyAvatarBtn.addEventListener('click', () => this.applyAvatar());
        } else {
            console.error('Apply Avatar button not found');
        }
    }

    setupClearAvatarButton() {
        const clearAvatarBtn = document.getElementById('clear-avatar-btn');
        if (clearAvatarBtn) {
            clearAvatarBtn.addEventListener('click', () => this.clearAvatar());
        } else {
            console.error('Clear Avatar button not found');
        }
    }

    loadEquippedItems() {
        const savedItems = localStorage.getItem(`equippedItems_${this.username}`);
        if (savedItems) {
            this.equippedItems = JSON.parse(savedItems);
            this.tempEquippedItems = {...this.equippedItems};
        }
        // New: Load skin tone
        const savedSkinTone = localStorage.getItem(`skinTone_${this.username}`);
        if (savedSkinTone) {
            this.skinTone = savedSkinTone;
        }
    }

    applyAvatar() {
        this.equippedItems = {...this.tempEquippedItems};
        localStorage.setItem(`equippedItems_${this.username}`, JSON.stringify(this.equippedItems));
        // New: Save skin tone
        localStorage.setItem(`skinTone_${this.username}`, this.skinTone);
        this.updateAvatarDisplay();
        alert('Avatar saved successfully!');
    }

    clearAvatar() {
        this.tempEquippedItems = {};
        this.updateItemVisuals();
        this.updateTempAvatarDisplay();
    }

    updateAvatarDisplay() {
        if (window.avatarBody) {
            window.avatarBody.clearAllLayers();
            
            // New: Apply skin tone
            if (window.skinToneManager) {
                window.skinToneManager.applySkinTone(window.skinToneManager.skinTones[this.skinTone]);
            }

            Object.entries(this.equippedItems).forEach(([type, itemId]) => {
                if (itemId) {
                    const item = window.userInventory.getItems().find(i => i.id === itemId);
                    if (item) {
                        window.avatarBody.updateLayer(type, `https://sxdgoth.github.io/jo/${item.path}${item.id}`);
                    }
                }
            });
        }
    }

    toggleItem(item) {
        if (this.tempEquippedItems[item.type] === item.id) {
            // Unequip the item
            delete this.tempEquippedItems[item.type];
        } else {
            // Equip the item
            this.tempEquippedItems[item.type] = item.id;
        }
        this.updateItemVisuals();
        this.updateTempAvatarDisplay();
    }

    updateItemVisuals() {
        document.querySelectorAll('.item-image').forEach(itemImage => {
            const itemId = itemImage.dataset.id;
            const item = window.userInventory.getItems().find(i => i.id === itemId);
            if (item && this.tempEquippedItems[item.type] === item.id) {
                itemImage.classList.add('equipped');
            } else {
                itemImage.classList.remove('equipped');
            }
        });
    }

    updateTempAvatarDisplay() {
        if (window.avatarBody) {
            window.avatarBody.clearAllLayers();
            
            // New: Apply skin tone
            if (window.skinToneManager) {
                window.skinToneManager.applySkinTone(window.skinToneManager.skinTones[this.skinTone]);
            }

            Object.entries(this.tempEquippedItems).forEach(([type, itemId]) => {
                if (itemId) {
                    const item = window.userInventory.getItems().find(i => i.id === itemId);
                    if (item) {
                        window.avatarBody.updateLayer(type, `https://sxdgoth.github.io/jo/${item.path}${item.id}`);
                    }
                }
            });
        }
    }

    // New method
    changeSkinTone(newTone) {
        this.skinTone = newTone;
        this.updateTempAvatarDisplay();
    }
}

// Initialize the AvatarManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        window.avatarManager = new AvatarManager(loggedInUser.username);
        window.avatarManager.initialize();
    } else {
        console.error('No logged in user found');
    }
});
