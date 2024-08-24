// shopManager.js

class ShopManager {
    constructor() {
        this.shopItems = []; // This should be populated with your shop items
    }

    renderShopItems() {
        const shopContainer = document.querySelector('.shop-container');
        shopContainer.innerHTML = ''; // Clear existing items

        this.shopItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'shop-item';
            itemElement.innerHTML = `
                <img src="${item.imageSrc}" alt="${item.name}" class="item-image" data-id="${item.id}">
                <p>${item.name}</p>
                <p>Price: ${item.price} coins</p>
                <button class="buy-btn" data-id="${item.id}">Buy</button>
            `;
            shopContainer.appendChild(itemElement);
        });
    }

    toggleItem(itemId) {
        console.log('toggleItem called with itemId:', itemId);
        const item = this.shopItems.find(i => i.id === itemId);
        if (item) {
            console.log(`Toggling item: ${item.name} (ID: ${item.id}, Type: ${item.type})`);
            if (window.shopAvatarDisplay && typeof window.shopAvatarDisplay.tryOnItem === 'function') {
                console.log('Calling shopAvatarDisplay.tryOnItem');
                window.shopAvatarDisplay.tryOnItem(item);
            } else {
                console.error('shopAvatarDisplay not found or tryOnItem is not a function');
            }
            this.updateSelectedItems();
        } else {
            console.error('Item not found for id:', itemId);
        }
    }

    updateSelectedItems() {
        console.log('Updating selected items');
        document.querySelectorAll('.shop-item').forEach(shopItem => {
            const image = shopItem.querySelector('.item-image');
            const itemId = image.dataset.id;
            const item = this.shopItems.find(i => i.id === itemId);
            
            if (window.shopAvatarDisplay.triedOnItems[item.type] && window.shopAvatarDisplay.triedOnItems[item.type].id === itemId) {
                console.log(`Adding 'selected' class to item: ${itemId}`);
                shopItem.classList.add('selected');
            } else {
                console.log(`Removing 'selected' class from item: ${itemId}`);
                shopItem.classList.remove('selected');
            }
        });
    }

    resetAvatarDisplay() {
        console.log('Resetting avatar display');
        if (window.shopAvatarDisplay) {
            window.shopAvatarDisplay.resetTriedOnItems();
        }
        this.updateSelectedItems();
    }

    buyItem(itemId) {
        // Implement buying logic here
        console.log(`Buying item with ID: ${itemId}`);
    }

    filterItemsByCategory(category) {
        // Implement category filtering logic here
        console.log(`Filtering items by category: ${category}`);
    }
}

// Initialize ShopManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing ShopManager");
    window.shopManager = new ShopManager();
    window.shopManager.renderShopItems();

    // Event delegation for shop interactions
    document.querySelector('.shop-container').addEventListener('click', function(e) {
        if (e.target.classList.contains('item-image')) {
            const itemId = e.target.dataset.id;
            window.shopManager.toggleItem(itemId);
        } else if (e.target.classList.contains('buy-btn')) {
            const itemId = e.target.dataset.id;
            window.shopManager.buyItem(itemId);
        }
    });

    // Add category filter buttons if needed
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            window.shopManager.filterItemsByCategory(category);
        });
    });

    // Add reset button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Tried-On Items';
    resetButton.addEventListener('click', () => window.shopManager.resetAvatarDisplay());
    document.querySelector('.shop-container').prepend(resetButton);
});
