class ShopManager {
    constructor(username) {
        this.username = username;
        this.baseUrl = 'https://sxdgoth.github.io/jo/';
        this.shopItems = shopItems;
        this.inventory = [];
        this.loadInventory();
    }

    loadInventory() {
        const savedInventory = localStorage.getItem(`inventory_${this.username}`);
        if (savedInventory) {
            this.inventory = JSON.parse(savedInventory);
        }
    }

    saveInventory() {
        localStorage.setItem(`inventory_${this.username}`, JSON.stringify(this.inventory));
    }

    updateShopDisplay() {
        const shopContainer = document.getElementById('shop-container');
        shopContainer.innerHTML = '';

        this.shopItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'shop-item';

            const img = document.createElement('object');
            img.type = 'image/svg+xml';
            img.data = `${this.baseUrl}${item.path}${item.id}`;
            img.className = 'item-image';
            img.dataset.id = item.id;

            // Apply skin tone to shop item (new addition)
            if (window.skinToneManager) {
                window.skinToneManager.applySkinToneToShopItem(img, item);
            }

            const nameElement = document.createElement('p');
            nameElement.textContent = item.name;

            const priceElement = document.createElement('p');
            priceElement.textContent = `Price: ${item.price}`;

            const buyButton = document.createElement('button');
            buyButton.textContent = 'Buy';
            buyButton.addEventListener('click', () => this.buyItem(item));

            const tryOnButton = document.createElement('button');
            tryOnButton.textContent = 'Try On';
            tryOnButton.addEventListener('click', () => this.tryOnItem(item));

            itemElement.appendChild(img);
            itemElement.appendChild(nameElement);
            itemElement.appendChild(priceElement);
            itemElement.appendChild(buyButton);
            itemElement.appendChild(tryOnButton);

            shopContainer.appendChild(itemElement);
        });
    }

    buyItem(item) {
        if (this.inventory.some(invItem => invItem.id === item.id)) {
            alert('You already own this item!');
            return;
        }

        this.inventory.push(item);
        this.saveInventory();
        alert(`You bought ${item.name}!`);

        if (window.inventoryManager) {
            window.inventoryManager.updateInventoryDisplay();
        }
    }

    tryOnItem(item) {
        if (window.avatarDisplay) {
            window.avatarDisplay.tryOnItem(item);
        } else {
            console.error('Avatar display not found');
        }
    }

    filterItems(category) {
        const filteredItems = category === 'all' 
            ? this.shopItems 
            : this.shopItems.filter(item => item.type === category);
        
        this.updateShopDisplay(filteredItems);
    }

    updateShopDisplay(items = this.shopItems) {
        const shopContainer = document.getElementById('shop-container');
        shopContainer.innerHTML = '';

        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'shop-item';

            const img = document.createElement('object');
            img.type = 'image/svg+xml';
            img.data = `${this.baseUrl}${item.path}${item.id}`;
            img.className = 'item-image';
            img.dataset.id = item.id;

            // Apply skin tone to shop item (new addition)
            if (window.skinToneManager) {
                window.skinToneManager.applySkinToneToShopItem(img, item);
            }

            const nameElement = document.createElement('p');
            nameElement.textContent = item.name;

            const priceElement = document.createElement('p');
            priceElement.textContent = `Price: ${item.price}`;

            const buyButton = document.createElement('button');
            buyButton.textContent = 'Buy';
            buyButton.addEventListener('click', () => this.buyItem(item));

            const tryOnButton = document.createElement('button');
            tryOnButton.textContent = 'Try On';
            tryOnButton.addEventListener('click', () => this.tryOnItem(item));

            itemElement.appendChild(img);
            itemElement.appendChild(nameElement);
            itemElement.appendChild(priceElement);
            itemElement.appendChild(buyButton);
            itemElement.appendChild(tryOnButton);

            shopContainer.appendChild(itemElement);
        });
    }
}

// Initialize the ShopManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        window.shopManager = new ShopManager(loggedInUser.username);
        window.shopManager.updateShopDisplay();

        // Set up category filter buttons
        const categoryButtons = document.querySelectorAll('.category-button');
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                window.shopManager.filterItems(category);
            });
        });
    } else {
        console.error('No logged in user found');
    }
});
