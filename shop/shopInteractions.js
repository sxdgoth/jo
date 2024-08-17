// File: shopInteractions.js

class ShopInteractions {
    constructor() {
        this.shopItemsContainer = document.querySelector('.shop-items');
        this.userCoinsElement = document.getElementById('user-coins');
        this.selectedItem = null;
        this.initialize();
    }

    initialize() {
        this.setupButtons();
        this.addSelectListeners();
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
        const shopItems = this.shopItemsContainer.querySelectorAll('.item-button');
        shopItems.forEach(item => {
            item.addEventListener('click', (event) => this.selectItem(event.target));
        });
    }

    selectItem(itemElement) {
        this.selectedItem = shopItems.find(item => item.name === itemElement.textContent.split(' ($')[0]);
        document.querySelectorAll('.item-button').forEach(el => el.classList.remove('selected'));
        itemElement.classList.add('selected');
    }

    buySelectedItem() {
        if (!this.selectedItem) {
            alert("Please select an item to buy.");
            return;
        }

        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (loggedInUser && loggedInUser.coins >= this.selectedItem.price) {
            loggedInUser.coins -= this.selectedItem.price;
            sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            this.userCoinsElement.textContent = loggedInUser.coins.toLocaleString();
            
            // Use the existing toggleItem function from avatarManager.js
            if (typeof toggleItem === 'function') {
                toggleItem(this.selectedItem);
            } else {
                console.error('toggleItem function not found. Make sure avatarManager.js is loaded before shopInteractions.js');
            }

            alert(`You bought ${this.selectedItem.name}!`);
        } else {
            alert("Not enough coins to buy this item!");
        }
    }

    clearAvatar() {
        const avatarDisplay = document.getElementById('avatar-display');
        const itemsToRemove = avatarDisplay.querySelectorAll('img:not([src*="avatar-legsandfeet"]):not([src*="avatar-armsandhands"]):not([src*="avatar-body"]):not([src*="avatar-head"])');
        itemsToRemove.forEach(item => item.remove());

        // Reset equipped items in avatarManager
        if (typeof equippedItems !== 'undefined') {
            equippedItems.clear();
        } else {
            console.error('equippedItems not found. Make sure avatarManager.js is loaded before shopInteractions.js');
        }

        // Reload avatar
        if (typeof loadAvatar === 'function') {
            loadAvatar();
        } else {
            console.error('loadAvatar function not found. Make sure avatarManager.js is loaded before shopInteractions.js');
        }
    }
}

// Initialize the ShopInteractions when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new ShopInteractions();
});
