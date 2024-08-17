// avatarManager.js

class AvatarManager {
    constructor() {
        this.equippedItems = {};
    }

    initialize() {
        this.loadEquippedItems();
        this.createButtons();
    }

   createButtons() {
    if (document.querySelector('.avatar-buttons')) {
        return; // Buttons already exist, don't create them again
    }

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
    if (avatarContainer) {
        // Insert the buttons after the avatar container
        avatarContainer.insertAddjacent(buttonContainer, 'afterend');
    }
}

    applyAvatar() {
        localStorage.setItem('equippedItems', JSON.stringify(this.equippedItems));
        alert('Avatar saved successfully!');
    }

    clearAvatar() {
        this.equippedItems = {};
        localStorage.removeItem('equippedItems');
        this.updateAvatarDisplay();
        document.querySelectorAll('.item-image.equipped').forEach(item => {
            item.classList.remove('equipped');
        });
        alert('Avatar cleared successfully!');
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

    toggleItem(item) {
        if (this.equippedItems[item.type] === item.id) {
            // Unequip the item
            delete this.equippedItems[item.type];
            window.avatarBody.updateLayer(item.type, null);
        } else {
            // Equip the item
            this.equippedItems[item.type] = item.id;
            window.avatarBody.updateLayer(item.type, `https://sxdgoth.github.io/jo/${item.path}${item.id}`);
        }
        this.updateItemVisuals();
    }

    updateItemVisuals() {
        document.querySelectorAll('.item-image').forEach(itemImage => {
            const itemId = itemImage.dataset.id;
            const item = window.userInventory.getItems().find(i => i.id === itemId);
            if (item && this.equippedItems[item.type] === item.id) {
                itemImage.classList.add('equipped');
            } else {
                itemImage.classList.remove('equipped');
            }
        });
    }
}

// Remove this event listener from here
// document.addEventListener('DOMContentLoaded', () => {
//     window.avatarManager = new AvatarManager();
//     window.avatarManager.initialize();
// });
