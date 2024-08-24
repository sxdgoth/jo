// itemSelector.js

class ItemSelector {
    constructor() {
        this.selectedItems = {};
        this.shopItemsContainer = document.querySelector('.shop-items');
        this.initEventListeners();
    }

    initEventListeners() {
        this.shopItemsContainer.addEventListener('click', (e) => {
            const itemImage = e.target.closest('.item-image');
            if (itemImage) {
                const itemId = itemImage.dataset.id;
                this.toggleItem(itemId);
            }
        });
    }

    toggleItem(itemId) {
        const item = shopItems.find(i => i.id === itemId);
        if (!item) {
            console.error('Item not found:', itemId);
            return;
        }

        if (this.selectedItems[item.type] === itemId) {
            // Unselect the item
            delete this.selectedItems[item.type];
            this.updateItemDisplay(itemId, false);
            if (window.avatarDisplay) {
                window.avatarDisplay.removeItem(item.type);
            }
        } else {
            // Select the item
            if (this.selectedItems[item.type]) {
                // Unselect the previously selected item of the same type
                this.updateItemDisplay(this.selectedItems[item.type], false);
            }
            this.selectedItems[item.type] = itemId;
            this.updateItemDisplay(itemId, true);
            if (window.avatarDisplay) {
                window.avatarDisplay.tryOnItem(item);
            }
        }
    }

    updateItemDisplay(itemId, isSelected) {
        const itemElement = this.shopItemsContainer.querySelector(`.item-image[data-id="${itemId}"]`);
        if (itemElement) {
            itemElement.classList.toggle('selected', isSelected);
        }
    }

    getSelectedItems() {
        return this.selectedItems;
    }

    resetSelection() {
        Object.keys(this.selectedItems).forEach(type => {
            this.updateItemDisplay(this.selectedItems[type], false);
        });
        this.selectedItems = {};
        if (window.avatarDisplay) {
            window.avatarDisplay.resetTriedOnItems();
        }
    }
}

// Initialize the ItemSelector when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.itemSelector = new ItemSelector();
});
