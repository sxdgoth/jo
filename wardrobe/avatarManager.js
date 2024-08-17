class AvatarManager {
    constructor() {
        this.equippedItems = {};
        this.pendingChanges = {};
    }

    initialize() {
        this.applyButton = document.getElementById('apply-avatar');
        this.clearButton = document.getElementById('clear-avatar');
        this.applyButton.addEventListener('click', () => this.applyAvatar());
        this.clearButton.addEventListener('click', () => this.clearAvatar());
        this.loadEquippedItems();
    }

    applyAvatar() {
        this.equippedItems = {...this.pendingChanges};
        this.saveEquippedItems();
        this.updateItemVisuals();
        alert('Avatar changes applied successfully!');
    }

    clearAvatar() {
        this.equippedItems = {};
        this.pendingChanges = {};
        this.saveEquippedItems();
        this.updateAvatarDisplay();
        this.updateItemVisuals();
        alert('Avatar cleared successfully!');
    }

    updateAvatarDisplay() {
        if (window.avatarBody) {
            const itemsToDisplay = {...this.equippedItems, ...this.pendingChanges};
            window.avatarBody.clearLayers();
            Object.entries(itemsToDisplay).forEach(([type, itemId]) => {
                const item = window.userInventory.getItems().find(i => i.id === itemId);
                if (item) {
                    window.avatarBody.updateLayer(type, `https://sxdgoth.github.io/jo/${item.path}${item.id}`);
                }
            });
        }
    }

    toggleItem(item) {
        if (this.pendingChanges[item.type] === item.id) {
            delete this.pendingChanges[item.type];
        } else {
            this.pendingChanges[item.type] = item.id;
        }
        this.updateAvatarDisplay();
        this.updateItemVisuals();
    }

    updateItemVisuals() {
        document.querySelectorAll('.item-image').forEach(itemImage => {
            const itemId = itemImage.dataset.id;
            const item = window.userInventory.getItems().find(i => i.id === itemId);
            if (item && (this.pendingChanges[item.type] === item.id || this.equippedItems[item.type] === item.id)) {
                itemImage.classList.add('equipped');
            } else {
                itemImage.classList.remove('equipped');
            }
        });
    }

    saveEquippedItems() {
        localStorage.setItem('equippedItems', JSON.stringify(this.equippedItems));
    }

    loadEquippedItems() {
        const savedItems = localStorage.getItem('equippedItems');
        if (savedItems) {
            this.equippedItems = JSON.parse(savedItems);
            this.updateAvatarDisplay();
            this.updateItemVisuals();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.avatarManager = new AvatarManager();
    window.avatarManager.initialize();
});



