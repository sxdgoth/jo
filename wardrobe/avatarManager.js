// avatarManager.js

class AvatarManager {
    constructor() {
        this.equippedItems = {};
        this.selectedItems = {};
    }

    initialize() {
        this.loadEquippedItems();
    }

    loadEquippedItems() {
        const savedItems = localStorage.getItem('equippedItems');
        if (savedItems) {
            this.equippedItems = JSON.parse(savedItems);
            this.updateAvatarDisplay();
        }
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

    toggleItemSelection(item) {
        if (this.selectedItems[item.type] === item.id) {
            // Unselect the item
            delete this.selectedItems[item.type];
        } else {
            // Select the item
            this.selectedItems[item.type] = item.id;
        }
        this.updateItemVisuals();
    }

    updateItemVisuals() {
        document.querySelectorAll('.item-image').forEach(itemImage => {
            const itemId = itemImage.dataset.id;
            const item = window.userInventory.getItems().find(i => i.id === itemId);
            if (item && this.selectedItems[item.type] === item.id) {
                itemImage.classList.add('selected');
            } else {
                itemImage.classList.remove('selected');
            }
        });
    }

    applySelectedItems() {
        this.equippedItems = {...this.selectedItems};
        this.updateAvatarDisplay();
        localStorage.setItem('equippedItems', JSON.stringify(this.equippedItems));
    }

    clearAvatar() {
        this.equippedItems = {};
        this.selectedItems = {};
        this.updateAvatarDisplay();
        this.updateItemVisuals();
        localStorage.removeItem('equippedItems');
    }
}

// Initialize the AvatarManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.avatarManager = new AvatarManager();
    window.avatarManager.initialize();
});
