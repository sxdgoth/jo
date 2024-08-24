// shopAvatarDisplay.js

class ShopAvatarDisplay extends AvatarDisplay {
    constructor(containerId, username) {
        super(containerId, username);
        this.triedOnItems = {};
        this.requiredTypes = ['Shirt', 'Pants', 'Nose', 'Eyes', 'Eyebrows', 'Mouth'];
    }

    tryOnItem(item) {
        console.log(`Trying on ${item.name} (ID: ${item.id}, Type: ${item.type})`);
        
        if (this.triedOnItems[item.type] && this.triedOnItems[item.type].id === item.id) {
            // If the same item is clicked again, only remove it if it's not a required type
            if (!this.requiredTypes.includes(item.type)) {
                this.removeTriedOnItem(item.type);
            }
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
        } else if (!this.requiredTypes.includes(type)) {
            // If no equipped item and not a required type, hide the layer
            this.updateAvatarDisplay(type, '');
        }
    }

    resetTriedOnItems() {
        Object.keys(this.triedOnItems).forEach(type => {
            if (!this.requiredTypes.includes(type)) {
                this.removeTriedOnItem(type);
            }
        });
    }

    updateAvatarDisplay(type, src) {
        super.updateAvatarDisplay(type, src);
        if (window.layerManager) {
            window.layerManager.reorderLayers();
        }
        this.applyItemPosition(type);
    }

    applyItemPosition(type) {
        const layer = this.layers[type];
        if (layer && window.applyItemPosition) {
            window.applyItemPosition(layer, type);
        }
    }
}

// Make sure ShopAvatarDisplay is available globally
window.ShopAvatarDisplay = ShopAvatarDisplay;
