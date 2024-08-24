class ItemSelector {
    constructor(avatarDisplay) {
        console.log('ItemSelector constructor called');
        this.avatarDisplay = avatarDisplay;
        this.selectedItems = {};
    }

    toggleItem(itemId) {
        console.log('ItemSelector: toggleItem called with itemId:', itemId);
        const item = shopItems.find(i => i.id === itemId);
        if (!item) {
            console.error('Item not found:', itemId);
            return;
        }

        if (this.selectedItems[item.type] === itemId) {
            console.log('Item already selected, removing');
            this.removeItem(item.type);
        } else {
            console.log('Item not selected, trying on');
            this.tryOnItem(item);
        }
    }

    tryOnItem(item) {
        console.log('Trying on item:', item.name);
        const itemSrc = `https://sxdgoth.github.io/jo/${item.path}${item.id}`;
        console.log('Updating avatar display with src:', itemSrc);
        this.avatarDisplay.updateAvatarDisplay(item.type, itemSrc);
        this.selectedItems[item.type] = item.id;
        this.updateItemSelection(item.id, true);
    }

    removeItem(type) {
        console.log('Removing item of type:', type);
        this.avatarDisplay.removeItem(type);
        if (this.selectedItems[type]) {
            this.updateItemSelection(this.selectedItems[type], false);
        }
        delete this.selectedItems[type];
    }

    updateItemSelection(itemId, isSelected) {
        console.log('Updating item selection:', itemId, isSelected);
        const itemElement = document.querySelector(`.item-image[data-id="${itemId}"]`);
        if (itemElement) {
            itemElement.classList.toggle('selected', isSelected);
        }
    }
}

// Make ItemSelector globally accessible
window.ItemSelector = ItemSelector;
