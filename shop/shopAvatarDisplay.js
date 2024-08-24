// shopAvatarDisplay.js

class ShopAvatarDisplay extends AvatarDisplay {
    constructor(containerId, username) {
        super(containerId, username);
        this.triedOnItems = {};
        this.requiredTypes = ['Shirt', 'Pants', 'Nose', 'Eyes', 'Eyebrows', 'Mouth'];
        console.log('ShopAvatarDisplay initialized');
    }

    tryOnItem(item) {
        console.log(`Trying on ${item.name} (ID: ${item.id}, Type: ${item.type})`);
        
        if (this.triedOnItems[item.type] && this.triedOnItems[item.type].id === item.id) {
            if (!this.requiredTypes.includes(item.type)) {
                this.removeTriedOnItem(item.type);
            }
        } else {
            this.triedOnItems[item.type] = item;
            const src = `https://sxdgoth.github.io/jo/${item.path}${item.id}`;
            console.log(`Updating avatar display with src: ${src}`);
            this.updateAvatarDisplay(item.type, src);
        }
        this.reorderLayers();
    }

    updateAvatarDisplay(type, src) {
        console.log(`ShopAvatarDisplay: Updating ${type} with src: ${src}`);
        super.updateAvatarDisplay(type, src);
        if (window.layerManager) {
            window.layerManager.reorderLayers();
        }
        this.applyItemPosition(type);
    }

    applyItemPosition(type) {
        const layer = this.layers[type];
        if (layer && window.applyItemPosition) {
            console.log(`Applying position to ${type}`);
            window.applyItemPosition(layer, type.toLowerCase());
        } else {
            console.log(`Failed to apply position to ${type}. Layer: ${!!layer}, applyItemPosition: ${!!window.applyItemPosition}`);
        }
    }
}

window.ShopAvatarDisplay = ShopAvatarDisplay;
