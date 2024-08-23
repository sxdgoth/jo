// itemSelector.js

class ItemSelector {
    constructor(avatarBody) {
        this.avatarBody = avatarBody;
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

        this.updateShopDisplay();
    }

    selectItem(item) {
        console.log(`Selecting item: ${item.name} (ID: ${item.id}, Type: ${item.type})`);
        if (this.selectedItems[item.type]) {
            this.avatarBody.removeItem(item.type);
        }
        this.selectedItems[item.type] = item.id;
        this.avatarBody.tryOnItem(item);
    }

    deselectItem(type) {
        console.log(`Deselecting item of type: ${type}`);
        delete this.selectedItems[type];
        this.avatarBody.removeItem(type);
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
            this.avatarBody.removeItem(type);
        });
        this.selectedItems = {};
        this.updateShopDisplay();
    }
}

// The initialization of ItemSelector is now handled in avatarTemplate.js
