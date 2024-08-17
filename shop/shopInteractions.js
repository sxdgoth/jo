// File: shopInteractions.js

class ShopInteractions {
    constructor() {
        this.shopItemsContainer = document.querySelector('.shop-items');
        this.userCoinsElement = document.getElementById('user-coins');
        this.selectedItem = null;
        this.layerManager = new LayerManager();
        this.initialize();
    }

    initialize() {
        this.setupButtons();
        this.addSelectListeners();
        this.layerManager.initialize();
    }

    setupButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const buyButton = document.createElement('button');
        buyButton.textContent = 'Buy';
        buyButton.addEventListener('click', () => this.buySelectedItem());

        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear Avatar';
        clearButton.addEventListener('click', () => this.clearAvatar());

        buttonContainer.appendChild(buyButton);
        buttonContainer.appendChild(clearButton);
        document.querySelector('.shop-section').appendChild(buttonContainer);
    }

    addSelectListeners() {
        const shopItemButtons = this.shopItemsContainer.querySelectorAll('.item-button');
        shopItemButtons.forEach(button => {
            button.addEventListener('click', (event) => this.selectItem(event.target));
        });
    }

    selectItem(itemElement) {
        const itemName = itemElement.textContent.split(' ($')[0];
        this.selectedItem = shopItems.find(item => item.name === itemName);
        document.querySelectorAll('.item-button').forEach(el => el.classList.remove('selected'));
        itemElement.classList.add('selected');
    }

    buySelectedItem() {
        if (!this.selectedItem) {
            alert("Please select an item to buy.");
            return;
        }

        // Use the existing toggleItem function from avatarManager.js
        if (typeof toggleItem === 'function') {
            toggleItem(this.selectedItem);
        } else {
            console.error('toggleItem function not found. Make sure avatarManager.js is loaded before shopInteractions.js');
        }
    }

    clearAvatar() {
        const equippedItems = window.equippedItems; // Access the equippedItems from avatarManager.js
        if (equippedItems) {
            equippedItems.clear();
        } else {
            console.error('equippedItems not found. Make sure avatarManager.js is loaded before shopInteractions.js');
        }

        // Use the existing loadAvatar function from avatarManager.js
        if (typeof loadAvatar === 'function') {
            loadAvatar();
        } else {
            console.error('loadAvatar function not found. Make sure avatarManager.js is loaded before shopInteractions.js');
        }

        this.layerManager.reorderLayers();
    }
}

// Initialize the ShopInteractions when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new ShopInteractions();
});
