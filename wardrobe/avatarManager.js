class AvatarManager {
    constructor() {
        this.equippedItems = {};
        this.tempEquippedItems = {};
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
        const savedItems = localStorage.getItem('equippedItems');
        if (savedItems) {
            this.equippedItems = JSON.parse(savedItems);
            this.tempEquippedItems = {...this.equippedItems};
        }
    }

    applyAvatar() {
        this.equippedItems = {...this.tempEquippedItems};
        localStorage.setItem('equippedItems', JSON.stringify(this.equippedItems));
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
}

// Initialize the AvatarManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.avatarManager = new AvatarManager();
    window.avatarManager.initialize();
});
