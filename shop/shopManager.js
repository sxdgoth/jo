// shopManager.js

class ShopManager {
    constructor() {
        this.shopItemsContainer = document.querySelector('.shop-items');
        this.userCoinsElement = document.getElementById('user-coins');
        this.selectedItem = null;
        this.initialize();
    }

    initialize() {
        this.createShopItems();
        this.setupButtons();
        this.updateUserInfo();
    }

    createShopItems() {
        console.log("Creating shop items...");
        // Clear existing items to prevent duplication
        this.shopItemsContainer.innerHTML = '';
        shopItems.forEach(item => {
            const button = document.createElement('button');
            button.textContent = `${item.name} ($${item.price})`;
            button.classList.add('item-button');
            button.onclick = () => this.selectItem(item);
            this.shopItemsContainer.appendChild(button);
        });
    }

    setupButtons() {
        // Check if buttons already exist
        if (document.querySelector('.button-container')) {
            return;
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const buyButton = document.createElement('button');
        buyButton.textContent = 'Buy';
        buyButton.addEventListener('click', () => this.buySelectedItem());

        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear Avatar';
        clearButton.addEventListener('click', () => clearAvatar());

        buttonContainer.appendChild(buyButton);
        buttonContainer.appendChild(clearButton);
        document.querySelector('.shop-section').appendChild(buttonContainer);
    }

    selectItem(item) {
        this.selectedItem = item;
        document.querySelectorAll('.item-button').forEach(el => el.classList.remove('selected'));
        event.target.classList.add('selected');
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
            this.updateUserInfo();
            toggleItem(this.selectedItem);
            alert(`You bought ${this.selectedItem.name}!`);
        } else {
            alert("Not enough coins to buy this item!");
        }
    }

    updateUserInfo() {
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            document.getElementById('user-name').textContent = loggedInUser.username;
            this.userCoinsElement.textContent = loggedInUser.coins.toLocaleString();
        }
    }
}

// Initialize the ShopManager when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new ShopManager();
});
