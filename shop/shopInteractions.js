// File: shopInteractions.js

class ShopInteractions {
    constructor() {
        this.svgContainer = document.getElementById('avatar-display');
        this.shopItemsContainer = document.querySelector('.shop-items');
        this.userCoinsElement = document.getElementById('user-coins');
        this.selectedItem = null;
        this.initialize();
    }

    initialize() {
        this.setupShopItems();
        this.setupButtons();
    }

    setupShopItems() {
        shopItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('shop-item');
            itemElement.textContent = `${item.name} ($${item.price})`;
            itemElement.addEventListener('click', () => this.selectItem(item));
            this.shopItemsContainer.appendChild(itemElement);
        });
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

    selectItem(item) {
        this.selectedItem = item;
        // Highlight the selected item (you may want to add some CSS for this)
        document.querySelectorAll('.shop-item').forEach(el => el.classList.remove('selected'));
        event.target.classList.add('selected');
    }

    buySelectedItem() {
        if (!this.selectedItem) {
            alert("Please select an item to buy.");
            return;
        }

        const userCoins = parseInt(this.userCoinsElement.textContent);
        if (userCoins >= this.selectedItem.price) {
            this.addItemToAvatar(this.selectedItem);
            this.updateUserCoins(userCoins - this.selectedItem.price);
            inventory.addItem(this.selectedItem);
            alert(`You bought ${this.selectedItem.name}!`);
        } else {
            alert("Not enough coins to buy this item!");
        }
    }

    addItemToAvatar(item) {
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
    }

    updateUserCoins(newAmount) {
        this.userCoinsElement.textContent = newAmount;
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            loggedInUser.coins = newAmount;
            sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        }
    }

    clearAvatar() {
        const itemsToRemove = this.svgContainer.querySelectorAll('img:not([data-type="Legs"]):not([data-type="Arms"]):not([data-type="Body"]):not([data-type="Head"])');
        itemsToRemove.forEach(item => item.remove());
    }
}

// Initialize the ShopInteractions when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new ShopInteractions();
});



New inventory.js file:
// File: inventory.js

class Inventory {
    con



Avatar for lalajrf-hinsj





