// File: shopInteractions.js

class ShopInteractions {
    constructor() {
        this.svgContainer = document.getElementById('avatar-display');
        this.shopItemsContainer = document.querySelector('.shop-items');
        this.userCoinsElement = document.getElementById('user-coins');
        this.clearButton = document.createElement('button');
        this.clearButton.textContent = 'Clear Avatar';
        this.clearButton.id = 'clear-avatar';
        this.initialize();
    }

    initialize() {
        this.setupShopItems();
        this.setupClearButton();
    }

    setupShopItems() {
        shopItems.forEach(item => {
            const itemContainer = document.createElement('div');
            itemContainer.classList.add('shop-item');

            const itemName = document.createElement('span');
            itemName.textContent = item.name;

            const itemPrice = document.createElement('span');
            itemPrice.textContent = `$${item.price}`;

            const buyButton = document.createElement('button');
            buyButton.textContent = 'Buy';
            buyButton.addEventListener('click', () => this.buyItem(item));

            itemContainer.appendChild(itemName);
            itemContainer.appendChild(itemPrice);
            itemContainer.appendChild(buyButton);

            this.shopItemsContainer.appendChild(itemContainer);
        });
    }

    setupClearButton() {
        this.clearButton.addEventListener('click', () => this.clearAvatar());
        document.querySelector('.shop-section').appendChild(this.clearButton);
    }

    buyItem(item) {
        const userCoins = parseInt(this.userCoinsElement.textContent);
        if (userCoins >= item.price) {
            this.addItemToAvatar(item);
            this.updateUserCoins(userCoins - item.price);
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
