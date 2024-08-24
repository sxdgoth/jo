class ItemSelector {
    constructor(avatarDisplay) {
        console.log('ItemSelector initialized');
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
        
        if (this.selectedItems[item.type]) {
            this.removeItem(item.type);
        }

        const itemSrc = `${this.avatarDisplay.baseUrl}${item.path}${item.id}`;
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
        } else {
            console.warn('Item element not found for id:', itemId);
        }
    }

    resetSelection() {
        console.log('Resetting selection');
        Object.keys(this.selectedItems).forEach(type => {
            this.removeItem(type);
        });
        this.selectedItems = {};
        this.avatarDisplay.resetTriedOnItems();
    }
}

// Initialize ItemSelector when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing ItemSelector');
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser && window.avatarDisplay) {
        window.itemSelector = new ItemSelector(window.avatarDisplay);
        console.log('ItemSelector initialized:', window.itemSelector);
    } else {
        console.error('AvatarDisplay not initialized or no logged in user found');
    }
});
