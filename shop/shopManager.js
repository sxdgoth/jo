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
                <div class="item-image" data-id="${item.id}">
                    <svg width="100%" height="100%">
                        <use href="${item.path}${item.id}#svgView(viewBox(0,0,100,100))" />
                    </svg>
                </div>
                <h3>${item.name}</h3>
                <p>Price: ${item.price} coins</p>
                <button class="buy-btn" data-id="${item.id}">Buy</button>
            `;
            shopContainer.appendChild(itemElement);
            
            // Apply item positioning
            const imageContainer = itemElement.querySelector('.item-image');
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
            window.applyItemPosition(itemElement, itemType.toLowerCase());
        }
    }

    addEventListeners() {
        const shopContainer = document.querySelector('.shop-items');
        shopContainer.addEventListener('click', (event) => {
            const itemContainer = event.target.closest('.item-image');
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
