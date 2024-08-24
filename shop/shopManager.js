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
                <div class="item-image-container" data-id="${item.id}">
                    <object type="image/svg+xml" data="${item.path}${item.id}" class="item-image"></object>
                </div>
                <p>${item.name}</p>
                <p>Price: ${item.price} coins</p>
                <button class="buy-btn" data-id="${item.id}">Buy</button>
            `;
            shopContainer.appendChild(itemElement);
            
            // Apply item positioning
            const imageContainer = itemElement.querySelector('.item-image-container');
            this.applyItemPosition(imageContainer, item.type);
            
            // Update buy button state
            const buyButton = itemElement.querySelector('.buy-btn');
            updateBuyButtonState(buyButton, item.id);
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
            const itemContainer = event.target.closest('.item-image-container');
            if (itemContainer) {
                const itemId = itemContainer.dataset.id;
                this.toggleItem(itemId);
            } else if (event.target.classList.contains('buy-btn')) {
                const itemId = event.target.dataset.id;
                window.buyItem(itemId);
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
