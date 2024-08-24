// shopAvatarDisplay.js

class ShopAvatarDisplay extends AvatarDisplay {
    constructor(containerId, username) {
        super(containerId, username);
        this.triedOnItems = {};
    }

    tryOnItem(item) {
        console.log(`Trying on ${item.name} (ID: ${item.id}, Type: ${item.type})`);
        
        if (this.triedOnItems[item.type] && this.triedOnItems[item.type].id === item.id) {
            // If the same item is clicked again, remove it
            this.removeTriedOnItem(item.type);
        } else {
            // Apply the new item
            this.triedOnItems[item.type] = item;
            this.updateAvatarDisplay(item.type, `${item.path}${item.id}`);
        }
        this.reorderLayers();
    }

    removeTriedOnItem(type) {
        console.log(`Removing tried-on item of type: ${type}`);
        delete this.triedOnItems[type];
        
        // Revert to equipped item if exists
        if (this.equippedItems[type]) {
            const equippedItem = shopItems.find(item => item.id === this.equippedItems[type]);
            if (equippedItem) {
                this.updateAvatarDisplay(type, `${equippedItem.path}${equippedItem.id}`);
            }
        } else {
            // If no equipped item, hide the layer
            this.updateAvatarDisplay(type, '');
        }
    }

    resetTriedOnItems() {
        Object.keys(this.triedOnItems).forEach(type => {
            this.removeTriedOnItem(type);
        });
        this.triedOnItems = {};
    }

    updateAvatarDisplay(type, src) {
        super.updateAvatarDisplay(type, src);
        if (window.layerManager) {
            window.layerManager.reorderLayers();
        }
    }
}

// Make sure ShopAvatarDisplay is available globally
window.ShopAvatarDisplay = ShopAvatarDisplay;
