class ItemSelector {
    constructor(avatarDisplay) {
        console.log('ItemSelector: Initializing with avatarDisplay');
        this.avatarDisplay = avatarDisplay;
        this.selectedItems = {};
    }

    toggleItem(itemId) {
        console.log('ItemSelector: toggleItem called with itemId:', itemId);
        const item = shopItems.find(i => i.id === itemId);
        if (!item) {
            console.error('ItemSelector: Item not found:', itemId);
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
        console.log(`ItemSelector: Selecting item: ${item.name} (ID: ${item.id}, Type: ${item.type})`);
        if (this.selectedItems[item.type]) {
            this.avatarDisplay.removeItem(item.type);
        }
        this.selectedItems[item.type] = item.id;
        this.avatarDisplay.tryOnItem(item);
    }

    deselectItem(type) {
        console.log(`ItemSelector: Deselecting item of type: ${type}`);
        delete this.selectedItems[type];
        this.avatarDisplay.removeItem(type);
    }

    updateShopDisplay() {
        if (window.shopManager) {
            window.shopManager.renderShopItems();
        }
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
