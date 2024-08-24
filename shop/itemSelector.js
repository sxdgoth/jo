class ItemSelector {
    constructor(avatarDisplay) {
        console.log('ItemSelector constructor called');
        this.avatarDisplay = avatarDisplay;
        this.selectedItems = {};
        this.currentCategory = 'All';
        this.shopItemsContainer = document.querySelector('.shop-items');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.item-image')) {
                const itemImage = e.target.closest('.item-image');
                const itemId = itemImage.dataset.id;
                console.log('ItemSelector: Item clicked:', itemId);
                this.toggleItem(itemId);
            } else if (e.target.classList.contains('buy-btn')) {
                const itemId = e.target.dataset.id;
                console.log('ItemSelector: Buy button clicked:', itemId);
                this.buyItem(itemId);
            } else if (e.target.classList.contains('category-btn')) {
                const category = e.target.dataset.category;
                console.log('ItemSelector: Category button clicked:', category);
                this.filterItemsByCategory(category);
            }
        });
    }

    renderShopItems() {
        console.log('Rendering shop items. Current category:', this.currentCategory);
        console.log('Total shop items:', shopItems.length);
        this.shopItemsContainer.innerHTML = '';
        const filteredItems = this.currentCategory === 'All' 
            ? shopItems 
            : shopItems.filter(item => item.type === this.currentCategory);
        console.log('Filtered items:', filteredItems.length);
        filteredItems.forEach(item => {
            console.log('Rendering item:', item.name);
            const itemElement = document.createElement('div');
            itemElement.classList.add('shop-item');
            const imgSrc = `https://sxdgoth.github.io/jo/${item.path}${item.id}`;
            itemElement.innerHTML = `
                <div class="item-image" data-id="${item.id}">
                    <img src="${imgSrc}" alt="${item.name}" onerror="this.onerror=null; this.src='https://via.placeholder.com/150'; console.error('Failed to load image: ${imgSrc}');">
                </div>
                <h3>${item.name}</h3>
                <p>${item.price} coins</p>
                <button class="buy-btn" data-id="${item.id}">Buy</button>
            `;
            this.shopItemsContainer.appendChild(itemElement);
            const buyButton = itemElement.querySelector('.buy-btn');
            this.updateBuyButtonState(buyButton, item.id);
            const imgElement = itemElement.querySelector('.item-image img');
            if (window.applyItemPosition) {
                window.applyItemPosition(imgElement, item.type.toLowerCase());
            }
        });
        this.updateCategoryButtons();
        this.updateSelectedItems();
    }

    toggleItem(itemId) {
        console.log('toggleItem called with itemId:', itemId);
        const item = shopItems.find(i => i.id === itemId);
        if (item) {
            console.log(`Toggling item: ${item.name} (ID: ${item.id}, Type: ${item.type})`);
            if (this.selectedItems[item.type] === itemId) {
                console.log('Item already selected, removing');
                this.removeItem(item.type);
            } else {
                console.log('Item not selected, trying on');
                this.tryOnItem(item);
            }
            this.updateSelectedItems();
        } else {
            console.error('Item not found for id:', itemId);
        }
    }

    tryOnItem(item) {
        console.log('Trying on item:', item.name);
        const itemSrc = `https://sxdgoth.github.io/jo/${item.path}${item.id}`;
        console.log('Updating avatar display with src:', itemSrc);
        this.avatarDisplay.updateAvatarDisplay(item.type, itemSrc);
        this.selectedItems[item.type] = item.id;
        this.updateItemSelection(item.id, true);
    }

    removeItem(type) {
        console.log('Removing item of type:', type);
        this.avatarDisplay.removeItem(type);
        if (this.selectedItems[type]) {
            this.updateItemSelection(this.selectedItems[type], false);
        }
        delete this.selectedItems[type];
    }

    updateItemSelection(itemId, isSelected) {
        console.log('Updating item selection:', itemId, isSelected);
        const itemElement = document.querySelector(`.item-image[data-id="${itemId}"]`);
        if (itemElement) {
            itemElement.classList.toggle('selected', isSelected);
        }
    }

    updateSelectedItems() {
        console.log('Updating selected items');
        document.querySelectorAll('.shop-item').forEach(shopItem => {
            const image = shopItem.querySelector('.item-image');
            const itemId = image.dataset.id;
            const item = shopItems.find(i => i.id === itemId);
            
            if (this.selectedItems[item.type] === itemId) {
                console.log(`Adding 'selected' class to item: ${itemId}`);
                shopItem.classList.add('selected');
            } else {
                console.log(`Removing 'selected' class from item: ${itemId}`);
                shopItem.classList.remove('selected');
            }
        });
    }

    buyItem(itemId) {
        console.log('Attempting to buy item:', itemId);
        const item = shopItems.find(i => i.id === itemId);
        if (!item) {
            console.error('Item not found');
            return;
        }
        const currentCoins = UserManager.getUserCoins();
        if (currentCoins < item.price) {
            alert('Not enough coins to buy this item!');
            return;
        }
        const newCoins = currentCoins - item.price;
        if (UserManager.updateUserCoins(newCoins)) {
            if (window.userInventory) {
                window.userInventory.addItem(item);
            }
            this.updateUserCoinsDisplay(newCoins);
            const buyButton = document.querySelector(`.buy-btn[data-id="${itemId}"]`);
            if (buyButton) {
                this.updateBuyButtonState(buyButton, itemId);
            }
            const itemImage = document.querySelector(`.item-image[data-id="${itemId}"]`);
            if (itemImage) {
                itemImage.classList.add('equipped');
                itemImage.classList.remove('selected');
            }
            alert(`You have successfully purchased ${item.name}!`);
        } else {
            alert('Error updating user coins. Please try again.');
        }
    }

    updateBuyButtonState(button, itemId) {
        if (window.userInventory && window.userInventory.hasItem(itemId)) {
            button.textContent = 'Owned';
            button.disabled = true;
            button.classList.add('owned');
        }
    }

    filterItemsByCategory(category) {
        console.log('Filtering items by category:', category);
        this.currentCategory = category;
        this.renderShopItems();
    }

    updateCategoryButtons() {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === this.currentCategory);
        });
    }

    updateUserCoinsDisplay(newCoins) {
        const coinsDisplay = document.getElementById('user-coins');
        if (coinsDisplay) {
            coinsDisplay.textContent = newCoins;
        }
    }

    resetAvatarDisplay() {
        console.log('Resetting avatar display');
        this.selectedItems = {};
        if (this.avatarDisplay) {
            this.avatarDisplay.resetTriedOnItems();
        }
        this.updateSelectedItems();
    }
}

// Make ItemSelector globally accessible
window.ItemSelector = ItemSelector;
