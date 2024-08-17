// shopManager.js

class ShopManager {
    constructor(shopItems) {
        this.shopItems = shopItems;
        this.shopItemsContainer = document.querySelector('.shop-items');
        this.userCoinsElement = document.getElementById('user-coins');
        this.selectedItem = null;
    }

    initShop() {
        console.log("Initializing shop...");
        this.createShopItems();
        this.setupButtons();
        this.updateUserInfo();
    }

    createShopItems() {
        console.log("Creating shop items...");
        this.shopItemsContainer.innerHTML = '';
        this.shopItems.forEach(item => {
            const button = document.createElement('button');
            button.textContent = `${item.name} ($${item.price})`;
            button.classList.add('item-button');
            button.addEventListener('click', () => this.selectItem(item));
            this.shopItemsContainer.appendChild(button);
        });
    }

    setupButtons() {
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
        clearButton.addEventListener('click', () => window.clearAvatar());

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
            window.toggleItem(this.selectedItem);
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
