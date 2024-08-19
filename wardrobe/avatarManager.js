class AvatarManager {
    constructor(username) {
        this.username = username;
        this.equippedItems = {};
        this.tempEquippedItems = {};
        this.skinTone = 'light';
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
        const savedSkinTone = localStorage.getItem(`skinTone_${this.username}`);
        if (savedSkinTone) {
            this.skinTone = savedSkinTone;
        }
    }

    applyAvatar() {
        this.equippedItems = {...this.tempEquippedItems};
        localStorage.setItem(`equippedItems_${this.username}`, JSON.stringify(this.equippedItems));
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
        if (window.avatarDisplay) {
            window.avatarDisplay.loadAvatar();
        }
    }

    toggleItem(item) {
        if (this.tempEquippedItems[item.type] === item.id) {
            delete this.tempEquippedItems[item.type];
        } else {
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
        if (window.avatarDisplay) {
            Object.entries(this.tempEquippedItems).forEach(([type, itemId]) => {
                if (itemId) {
                    const item = window.userInventory.getItems().find(i => i.id === itemId);
                    if (item) {
                        window.avatarDisplay.tryOnItem(item);
                    }
                }
            });
        }
    }

    changeSkinTone(newTone) {
        this.skinTone = newTone;
        if (window.avatarDisplay) {
            window.avatarDisplay.changeSkinTone(newTone);
        }
    }
}

// Initialize the AvatarManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        window.avatarManager = new AvatarManager(loggedInUser.username);
        window.avatarManager.initialize();

        // Set up skin tone buttons
        const skinToneButtons = document.querySelectorAll('.skin-tone-button');
        skinToneButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tone = button.dataset.tone;
                window.avatarManager.changeSkinTone(tone);
            });
        });
    } else {
        console.error('No logged in user found');
    }
});
