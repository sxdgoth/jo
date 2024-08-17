// File: shopManager.js

class ShopManager {
    constructor() {
        this.shopItemsContainer = document.querySelector('.shop-items');
        this.avatarDisplay = document.getElementById('avatar-display');
        this.equippedItems = new Set();
        this.initialize();
    }

    initialize() {
        this.createShopItems();
    }

    createShopItems() {
        shopItems.forEach(item => {
            const button = document.createElement('button');
            button.textContent = `${item.name} ($${item.price})`;
            button.classList.add('item-button');
            button.onclick = () => this.toggleItem(item);
            this.shopItemsContainer.appendChild(button);
        });
    }

    toggleItem(item) {
        console.log("Toggling item:", item.name);
        if (this.equippedItems.has(item.id)) {
            this.unequipItem(item);
        } else {
            this.equipItem(item);
        }
    }

    equipItem(item) {
        console.log("Equipping item:", item.name);
        const img = document.createElement('img');
        img.src = `https://sxdgoth.github.io/jo/${item.path}${item.id}`;
        img.alt = item.name;
        img.dataset.id = item.id;
        img.dataset.type = item.type;
        img.style.position = 'absolute';
        img.style.top = '0';
        img.style.left = '0';
        img.style.width = '100%';
        img.style.height = '100%';
        img.onerror = () => console.error("Failed to load image:", img.src);
        
        this.avatarDisplay.appendChild(img);
        this.equippedItems.add(item.id);

        // Use the global layerManager instance
        if (window.layerManager) {
            window.layerManager.reorderLayers();
        } else {
            console.error('layerManager not found. Make sure layerManager.js is loaded before shopManager.js');
        }
    }

    unequipItem(item) {
        console.log("Unequipping item:", item.name);
        const img = this.avatarDisplay.querySelector(`img[data-id="${item.id}"]`);
        if (img) {
            img.remove();
        }
        this.equippedItems.delete(item.id);

        // Use the global layerManager instance
        if (window.layerManager) {
            window.layerManager.reorderLayers();
        } else {
            console.error('layerManager not found. Make sure layerManager.js is loaded before shopManager.js');
        }
    }
}

// Initialize the ShopManager when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new ShopManager();
});
