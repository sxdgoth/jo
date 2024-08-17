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
    }

    applyAvatar() {
        this.equippedItems = {...this.pendingChanges};
        this.updateAvatarDisplay();
        this.updateItemVisuals();
        alert('Avatar changes applied successfully!');
    }

    clearAvatar() {
        this.equippedItems = {};
        this.pendingChanges = {};
        this.updateAvatarDisplay();
        this.updateItemVisuals();
        alert('Avatar cleared successfully!');
    }

    updateAvatarDisplay() {
        if (window.avatarBody) {
            Object.entries(this.equippedItems).forEach(([type, itemId]) => {
                const item = window.userInventory.getItems().find(i => i.id === itemId);
                if (item) {
                    window.avatarBody.updateLayer(type, `https://sxdgoth.github.io/jo/${item.path}${item.id}`);
                } else {
                    window.avatarBody.updateLayer(type, null);
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
        this.updateItemVisuals();
    }

    updateItemVisuals() {
        document.querySelectorAll('.item-image').forEach(itemImage => {
            const itemId = itemImage.dataset.id;
            const item = window.userInventory.getItems().find(i => i.id === itemId);
            if (item && this.pendingChanges[item.type] === item.id) {
                itemImage.classList.add('pending');
            } else {
                itemImage.classList.remove('pending');
            }
            if (item && this.equippedItems[item.type] === item.id) {
                itemImage.classList.add('equipped');
            } else {
                itemImage.classList.remove('equipped');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.avatarManager = new AvatarManager();
    window.avatarManager.initialize();
});
