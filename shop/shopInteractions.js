// File: shopInteractions.js

class ShopInteractions {
    constructor() {
        this.svgContainer = document.getElementById('body-svg');
        this.shopItemsContainer = document.querySelector('.shop-items');
        this.userCoinsElement = document.getElementById('user-coins');
        this.clearButton = document.getElementById('clear-avatar');
        this.initialize();
    }

    initialize() {
        this.setupShopItems();
        this.setupClearButton();
    }

    setupShopItems() {
        shopItems.forEach(item => {
            const button = document.createElement('button');
            button.textContent = `${item.name} ($${item.price})`;
            button.classList.add('item-button');
            button.addEventListener('click', () => this.buyItem(item));
            this.shopItemsContainer.appendChild(button);
        });
    }

    setupClearButton() {
        if (this.clearButton) {
            this.clearButton.addEventListener('click', () => this.clearAvatar());
        }
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
        const itemElement = document.createElementNS("http://www.w3.org/2000/svg", "image");
        itemElement.setAttribute("href", `https://sxdgoth.github.io/jo/${item.path}${item.id}`);
        itemElement.setAttribute("width", "100%");
        itemElement.setAttribute("height", "100%");
        itemElement.setAttribute("data-body-part", item.type.toLowerCase());

        const groupElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
        groupElement.appendChild(itemElement);
        groupElement.setAttribute("data-body-part", item.type.toLowerCase());

        this.svgContainer.appendChild(groupElement);
    }

    updateUserCoins(newAmount) {
        this.userCoinsElement.textContent = newAmount;
        // You might want to update the user's coins in session storage here as well
    }

    clearAvatar() {
        const itemsToRemove = this.svgContainer.querySelectorAll('g:not([data-body-part="legs"]):not([data-body-part="arms"]):not([data-body-part="body"]):not([data-body-part="head"])');
        itemsToRemove.forEach(item => item.remove());
    }
}

// Initialize the ShopInteractions when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new ShopInteractions();
});
