// shopAvatarDisplay.js

class ShopAvatarDisplay extends AvatarDisplay {
    constructor(containerId, username) {
        super(containerId, username);
        console.log('ShopAvatarDisplay initialized');
    }

    tryOnItem(item) {
        console.log(`ShopAvatarDisplay: Trying on ${item.name} (ID: ${item.id}, Type: ${item.type})`);
        super.tryOnItem(item);
    }

    updateAvatarDisplay(type, src) {
        console.log(`ShopAvatarDisplay: Updating ${type} with src: ${src}`);
        super.updateAvatarDisplay(type, src);
    }

    resetTriedOnItems() {
        console.log('ShopAvatarDisplay: Resetting tried on items');
        super.resetTriedOnItems();
    }
}

// Make ShopAvatarDisplay globally available
window.ShopAvatarDisplay = ShopAvatarDisplay;
