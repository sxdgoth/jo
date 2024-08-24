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
            // Item is already selected, so remove it
            this.removeItem(item.type);
        } else {
            // Item is not selected, so try it on
            this.tryOnItem(item);
        }
    }

    tryOnItem(item) {
        console.log('Trying on item:', item.name);
        
        // Remove previously selected item of the same type
        if (this.selectedItems[item.type]) {
            this.removeItem(item.type);
        }

        // Update the avatar display
        const itemSrc = `${this.avatarDisplay.baseUrl}${item.path}${item.id}`;
        this.avatarDisplay.updateAvatarDisplay(item.type, itemSrc);

        // Mark the item as selected
        this.selectedItems[item.type] = item.id;

        // Update UI to show the item as selected
        this.updateItemSelection(item.id, true);
    }

    removeItem(type) {
        console.log('Removing item of type:', type);
        
        // Remove the item from the avatar display
        this.avatarDisplay.removeItem(type);

        // Update UI to show the item as deselected
        if (this.selectedItems[type]) {
            this.updateItemSelection(this.selectedItems[type], false);
        }

        // Remove the item from selected items
        delete this.selectedItems[type];
    }

    updateItemSelection(itemId, isSelected) {
        const itemElement = document.querySelector(`.item-image[data-id="${itemId}"]`);
        if (itemElement) {
            itemElement.classList.toggle('selected', isSelected);
        }
    }

    resetSelection() {
        Object.keys(this.selectedItems).forEach(type => {
            this.removeItem(type);
        });
        this.selectedItems = {};
        this.avatarDisplay.resetTriedOnItems();
    }
}

// Initialize ItemSelector when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser && window.avatarDisplay) {
        window.itemSelector = new ItemSelector(window.avatarDisplay);
    } else {
        console.error('AvatarDisplay not initialized or no logged in user found');
    }
});
