// shopManager.js

class ShopManager {
    constructor() {
        this.shopItemsContainer = document.querySelector('.shop-items');
        this.categoryButtons = document.querySelectorAll('.category-btn');
        this.currentCategory = 'All';
        this.init();
    }

    init() {
        this.loadShopItems();
        this.addEventListeners();
    }

    loadShopItems() {
        this.shopItemsContainer.innerHTML = '';
        const itemsToDisplay = this.currentCategory === 'All' 
            ? shopItems 
            : shopItems.filter(item => item.type === this.currentCategory);

        itemsToDisplay.forEach(item => {
            const itemElement = this.createShopItemElement(item);
            this.shopItemsContainer.appendChild(itemElement);
        });
    }

    createShopItemElement(item) {
        const itemElement = document.createElement('div');
        itemElement.classList.add('shop-item');
        itemElement.dataset.itemId = item.id;

        const img = document.createElement('img');
        img.src = `https://sxdgoth.github.io/jo/${item.path}${item.id}`;
        img.alt = item.name;

        const name = document.createElement('p');
        name.textContent = item.name;

        const price = document.createElement('p');
        price.textContent = `${item.price} coins`;

        const buyButton = document.createElement('button');
        buyButton.textContent = 'Buy';
        buyButton.addEventListener('click', () => this.buyItem(item));

        itemElement.appendChild(img);
        itemElement.appendChild(name);
        itemElement.appendChild(price);
        itemElement.appendChild(buyButton);

        return itemElement;
    }

    addEventListeners() {
        this.categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.currentCategory = button.dataset.category;
                this.updateActiveCategory();
                this.loadShopItems();
            });
        });

        // Add event listener for item selection
        this.shopItemsContainer.addEventListener('click', (event) => {
            const itemElement = event.target.closest('.shop-item');
            if (itemElement && !event.target.matches('button')) {
                const itemId = itemElement.dataset.itemId;
                const selectedItem = shopItems.find(item => item.id === itemId);
                if (selectedItem) {
                    this.selectItem(selectedItem);
                }
            }
        });
    }

    updateActiveCategory() {
        this.categoryButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.category === this.currentCategory);
        });
    }

    buyItem(item) {
        // Implement buying logic here
        console.log(`Buying ${item.name} for ${item.price} coins`);
        // You may want to update user's inventory and coins here
    }

    // New method to handle item selection
    selectItem(item) {
        console.log(`Selecting ${item.name}`);
        if (window.avatarBody && typeof window.avatarBody.selectItem === 'function') {
            window.avatarBody.selectItem(item);
        } else {
            console.warn('avatarBody.selectItem is not available');
        }
        // You may want to update the UI to show the item as selected
    }
}

// Initialize the shop manager when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    window.shopManager = new ShopManager();
});
