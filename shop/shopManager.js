// shopManager.js

class ShopManager {
    constructor(items) {
        this.items = items;
        this.equippedItems = new Set();
    }

    initShop() {
        console.log("Initializing shop with items:", this.items);
        const shopItemsContainer = document.querySelector('.shop-items');
        if (!shopItemsContainer) {
            console.error("Shop items container not found!");
            return;
        }
        this.items.forEach(item => {
            const button = document.createElement('button');
            button.textContent = `${item.name} ($${item.price})`;
            button.classList.add('item-button');
            button.addEventListener('click', () => this.toggleItem(item));
            shopItemsContainer.appendChild(button);
            console.log(`Added button for item: ${item.name}`);
        });
        this.loadEquippedItems();
    }

    toggleItem(item) {
        console.log(`Toggling item: ${item.name}`);
        if (this.equippedItems.has(item.id)) {
            this.unequipItem(item);
        } else {
            this.equipItem(item);
        }
        this.updateUserCoins(item);
        this.saveEquippedItems();
    }

    equipItem(item) {
        console.log(`Equipping item: ${item.name}`);
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
        layerManager.addLayer(img);
        this.equippedItems.add(item.id);
    }

    unequipItem(item) {
        console.log(`Unequipping item: ${item.name}`);
        layerManager.removeLayer(item.id);
        this.equippedItems.delete(item.id);
    }

    updateUserCoins(item) {
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            if (this.equippedItems.has(item.id)) {
                loggedInUser.coins -= item.price;
            } else {
                loggedInUser.coins += item.price;
            }
            sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            document.getElementById('user-coins').textContent = loggedInUser.coins.toLocaleString();
        }
    }

    saveEquippedItems() {
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            loggedInUser.equippedItems = Array.from(this.equippedItems);
            sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        }
    }

    loadEquippedItems() {
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (loggedInUser && loggedInUser.equippedItems) {
            loggedInUser.equippedItems.forEach(itemId => {
                const item = this.items.find(i => i.id === itemId);
                if (item) {
                    this.equipItem(item);
                }
            });
        }
    }
}

// Initialize the shop when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    if (typeof shopItems !== 'undefined' && Array.isArray(shopItems)) {
        console.log('Shop items loaded:', shopItems);
        const shopManager = new ShopManager(shopItems);
        shopManager.initShop();
    } else {
        console.error('Shop items not found or not an array');
    }
});
