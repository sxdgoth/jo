class AvatarManager {
    constructor() {
        this.equippedItems = {};
        this.tempEquippedItems = {};
    }

    initialize() {
        this.createButtons();
        this.setupApplyAvatarButton();
    }

    setupApplyAvatarButton() {
        const applyAvatarBtn = document.getElementById('apply-avatar-btn');
        if (applyAvatarBtn) {
            applyAvatarBtn.addEventListener('click', () => this.applyAvatar());
        }
    }

    applyAvatar() {
        this.equippedItems = {...this.tempEquippedItems};
        localStorage.setItem('equippedItems', JSON.stringify(this.equippedItems));
        this.updateAvatarDisplay();
        alert('Avatar saved successfully!');
    }

    clearAvatar() {
        this.equippedItems = {};
        this.tempEquippedItems = {};
        localStorage.removeItem('equippedItems');
        this.updateAvatarDisplay();
        document.querySelectorAll('.item-image.equipped').forEach(item => {
            item.classList.remove('equipped');
        });
        alert('Avatar cleared successfully!');
    }

    updateAvatarDisplay() {
        if (window.avatarBody) {
            Object.entries(this.equippedItems).forEach(([type, itemId]) => {
                const item = window.userInventory.getItems().find(i => i.id === itemId);
                if (item) {
                    window.avatarBody.updateLayer(type, `https://sxdgoth.github.io/jo/${item.path}${item.id}`);
                }
            });
        }
    }

    toggleItem(item) {
        if (this.tempEquippedItems[item.type] === item.id) {
            // Unequip the item
            delete this.tempEquippedItems[item.type];
            window.avatarBody.updateLayer(item.type, null);
        } else {
            // Equip the item
            this.tempEquippedItems[item.type] = item.id;
            window.avatarBody.updateLayer(item.type, `https://sxdgoth.github.io/jo/${item.path}${item.id}`);
        }
        this.updateItemVisuals();
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
}

// Initialize the AvatarManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.avatarManager = new AvatarManager();
    window.avatarManager.initialize();
});
