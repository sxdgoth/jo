class AvatarManager {
    constructor() {
        this.equippedItems = {};
        this.pendingChanges = {};
    }

    initialize() {
        this.createButtons();
    }

    createButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'avatar-buttons';
        const applyButton = document.createElement('button');
        applyButton.textContent = 'Apply Avatar';
        applyButton.onclick = () => this.applyAvatar();
        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear Avatar';
        clearButton.onclick = () => this.clearAvatar();
        buttonContainer.appendChild(applyButton);
        buttonContainer.appendChild(clearButton);
        const avatarContainer = document.querySelector('.avatar-container');
        avatarContainer.insertBefore(buttonContainer, avatarContainer.firstChild);
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
            // Unequip the item
            delete this.pendingChanges[item.type];
        } else {
            // Equip the item
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
