// shopManager.js

class ShopManager {
    constructor(shopItems) {
        this.shopItems = shopItems;
        this.currentCategory = 'All';
        console.log("ShopManager initialized with", this.shopItems.length, "items");
    }

    renderShopItems() {
        console.log("Rendering shop items");
        const shopContainer = document.querySelector('.shop-items');
        if (!shopContainer) {
            console.error("Shop items container not found");
            return;
        }
        
        shopContainer.innerHTML = ''; // Clear existing items

        const itemsToRender = this.currentCategory === 'All' 
            ? this.shopItems 
            : this.shopItems.filter(item => item.type === this.currentCategory);

        itemsToRender.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'shop-item';
            itemElement.innerHTML = `
                <img src="${item.path}${item.id}" alt="${item.name}" class="item-image" data-id="${item.id}">
                <p>${item.name}</p>
                <p>Price: ${item.price} coins</p>
                <button class="buy-btn" data-id="${item.id}">Buy</button>
            `;
            shopContainer.appendChild(itemElement);
            this.applyItemPosition(itemElement.querySelector('.item-image'), item.type);
        });
        console.log(`Rendered ${itemsToRender.length} shop items`);

        this.addEventListeners();
    }

    applyItemPosition(itemElement, itemType) {
        if (window.applyItemPosition) {
            window.applyItemPosition(itemElement, itemType);
        }
    }

    addEventListeners() {
        const shopContainer = document.querySelector('.shop-items');
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
        }
    }

    buyItem(itemId) {
        console.log('Buying item:', itemId);
        // Implement buying logic here
    }

    resetAvatarDisplay() {
        if (window.shopAvatarDisplay) {
            window.shopAvatarDisplay.resetTriedOnItems();
        }
    }

    filterItemsByCategory(category) {
        console.log('Filtering by category:', category);
        this.currentCategory = category;
        this.renderShopItems();
    }
}

// Make ShopManager globally available
window.ShopManager = ShopManager;
