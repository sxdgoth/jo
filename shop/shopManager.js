// shopManager.js

class ShopManager {
    constructor() {
        this.shopItems = window.shopItems || [];
    }

    renderShopItems() {
        console.log("Rendering shop items");
        const shopContainer = document.querySelector('.shop-container');
        if (!shopContainer) {
            console.error("Shop container not found");
            return;
        }
        
        if (this.shopItems.length === 0) {
            console.warn("No shop items to display");
            return;
        }

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
        console.log(`Rendered ${this.shopItems.length} shop items`);

        // Add event listeners
        this.addEventListeners();
    }

    addEventListeners() {
        const shopContainer = document.querySelector('.shop-container');
        shopContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('item-image')) {
                const itemId = event.target.dataset.id;
                this.toggleItem(itemId);
            } else if (event.target.classList.contains('buy-btn')) {
                const itemId = event.target.dataset.id;
                this.buyItem(itemId);
            }
        });
    }

    toggleItem(itemId) {
        console.log('Toggling item:', itemId);
        const item = this.shopItems.find(i => i.id === itemId);
        if (item && window.shopAvatarDisplay) {
            window.shopAvatarDisplay.tryOnItem(item);
            this.updateSelectedItems();
        }
    }

    updateSelectedItems() {
        document.querySelectorAll('.shop-item').forEach(shopItem => {
            const image = shopItem.querySelector('.item-image');
            const itemId = image.dataset.id;
            const item = this.shopItems.find(i => i.id === itemId);
            
            if (window.shopAvatarDisplay.triedOnItems[item.type] && window.shopAvatarDisplay.triedOnItems[item.type].id === itemId) {
                shopItem.classList.add('selected');
            } else {
                shopItem.classList.remove('selected');
            }
        });
    }

    resetAvatarDisplay() {
        if (window.shopAvatarDisplay) {
            window.shopAvatarDisplay.resetTriedOnItems();
        }
        this.updateSelectedItems();
    }

    buyItem(itemId) {
        console.log('Buying item:', itemId);
        // Implement buying logic here
    }
}

// Initialize ShopManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing ShopManager");
    window.shopManager = new ShopManager();
});
