// itemSelector.js

class ItemSelector {
    constructor(avatarDisplay) {
        this.avatarDisplay = avatarDisplay;
        this.selectedItems = {};
    }

    toggleItem(itemId) {
        const item = shopItems.find(i => i.id === itemId);
        if (!item) {
            console.error('Item not found:', itemId);
            return;
        }

        if (this.selectedItems[item.type] === itemId) {
            this.deselectItem(item.type);
        } else {
            this.selectItem(item);
        }

        this.updateShopDisplay();
    }

    selectItem(item) {
        if (this.selectedItems[item.type]) {
            this.avatarDisplay.removeItem(item.type);
        }
        this.selectedItems[item.type] = item.id;
        this.avatarDisplay.tryOnItem(item);
    }

    deselectItem(type) {
        delete this.selectedItems[type];
        this.avatarDisplay.removeItem(type);
    }

    updateShopDisplay() {
        document.querySelectorAll('.shop-item').forEach(shopItem => {
            const itemId = shopItem.querySelector('.item-image').dataset.id;
            const item = shopItems.find(i => i.id === itemId);
            
            if (this.selectedItems[item.type] === item.id) {
                shopItem.classList.add('highlighted');
            } else {
                shopItem.classList.remove('highlighted');
            }
        });
    }

    resetSelection() {
        Object.keys(this.selectedItems).forEach(type => {
            this.avatarDisplay.removeItem(type);
        });
        this.selectedItems = {};
        this.updateShopDisplay();
    }
}

// Initialize the ItemSelector when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.avatarDisplay) {
        window.itemSelector = new ItemSelector(window.avatarDisplay);
    } else {
        console.error('AvatarDisplay not initialized');
    }
});
