// itemSelector.js

class ItemSelector {
    constructor(avatarDisplay) {
        this.avatarDisplay = avatarDisplay;
        this.selectedItems = {};
    }

    toggleItem(itemId) {
        console.log('toggleItem called with itemId:', itemId);
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

        if (window.shopManager) {
            window.shopManager.updateItemImages();
        }
    }

    selectItem(item) {
        console.log(`Selecting item: ${item.name} (ID: ${item.id}, Type: ${item.type})`);
        if (this.selectedItems[item.type]) {
            this.avatarDisplay.removeItem(item.type);
        }
        this.selectedItems[item.type] = item.id;
        this.avatarDisplay.tryOnItem(item);
    }

    deselectItem(type) {
        console.log(`Deselecting item of type: ${type}`);
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
        console.log('Resetting all selections');
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
        console.log('ItemSelector initialized');

        // Add click event listener for item selection
        document.addEventListener('click', function(e) {
            if (e.target.closest('.item-image')) {
                const itemId = e.target.closest('.item-image').dataset.id;
                console.log('Item clicked:', itemId);
                window.itemSelector.toggleItem(itemId);
            }
        });
    } else {
        console.error('AvatarDisplay not initialized');
    }
});
