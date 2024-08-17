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

    updateSelectedItems(item) {
        if (this.selectedItems[item.type] === item.id) {
            delete this.selectedItems[item.type];
        } else {
            this.selectedItems[item.type] = item.id;
        }
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
        document.querySelectorAll('.item-image.selected').forEach(item => {
            item.classList.remove('selected');
        });
        localStorage.removeItem('equippedItems');
    }
}

// Initialize the AvatarManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.avatarManager = new AvatarManager();
    window.avatarManager.initialize();
});
