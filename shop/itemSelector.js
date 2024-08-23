// itemSelector.js

class ItemSelector {
    constructor(avatarDisplay) {
        this.avatarDisplay = avatarDisplay;
        this.selectedItems = {};
    }

    toggleItem(itemId) {
        console.log('ItemSelector: toggleItem called with itemId:', itemId);
        const item = shopItems.find(i => i.id === itemId);
        if (!item) {
            console.error('ItemSelector: Item not found:', itemId);
            return;
        }

        if (this.selectedItems[item.type] === itemId) {
            console.log('ItemSelector: Deselecting item');
            this.deselectItem(item.type);
        } else {
            console.log('ItemSelector: Selecting item');
            this.selectItem(item);
        }

        this.updateShopDisplay();
    }

    selectItem(item) {
        this.selectedItems[item.type] = item.id;
        this.avatarDisplay.tryOnItem(item);
    }

    deselectItem(type) {
        delete this.selectedItems[type];
        this.avatarDisplay.removeItem(type);
    }

    updateShopDisplay() {
        document.querySelectorAll('.item-image').forEach(itemElement => {
            const itemId = itemElement.dataset.id;
            const item = shopItems.find(i => i.id === itemId);
            if (item) {
                itemElement.classList.toggle('selected', this.selectedItems[item.type] === itemId);
            }
        });
    }

    resetSelection() {
        this.selectedItems = {};
        this.updateShopDisplay();
    }
}

// Initialize ItemSelector when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing ItemSelector');
    if (window.avatarDisplay) {
        window.itemSelector = new ItemSelector(window.avatarDisplay);
        console.log('ItemSelector initialized');
    } else {
        console.error('avatarDisplay not found when creating ItemSelector');
    }
});
